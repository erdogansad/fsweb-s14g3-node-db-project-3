const db = require("../../data/db-config.js");

function find() {
  return db
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .from("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id", "asc");
}

async function findById(scheme_id) {
  let data = await db
      .select("sc.scheme_name")
      .select("st.*")
      .from("schemes as sc")
      .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
      .where({ "sc.scheme_id": scheme_id })
      .orderBy("st.step_number", "asc"),
    obj = {};

  if (data.length > 0) {
    obj.scheme_id = Number(scheme_id);
    obj.scheme_name = data[0].scheme_name;
    obj.steps = [];
    data.forEach((d) => {
      if (d.step_id !== null) {
        obj.steps.push({
          step_id: d.step_id,
          step_number: d.step_number,
          instructions: d.instructions,
        });
      }
    });
  }

  return obj;
}

function findSteps(scheme_id) {
  return db
    .select("st.step_id", "st.step_number", "st.instructions")
    .select("sc.scheme_name")
    .from("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .where({ "st.scheme_id": scheme_id })
    .orderBy("st.step_number", "asc");
}

async function add(scheme) {
  let id = await db("schemes").insert({ scheme_name: scheme });
  return {
    scheme_id: id[0],
    ...scheme,
  };
}

async function addStep(scheme_id, step) {
  await db("steps").insert({ scheme_id: scheme_id, ...step });
  return db("steps").where({ scheme_id: scheme_id }).orderBy("step_number", "asc");
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
