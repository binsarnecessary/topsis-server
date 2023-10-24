module.exports = exports = (app, pool) => {
  app.get("/api/criteria", (req, res) => {
    const query = `select * from m_criteria order by id`;

    pool.query(query, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      } else {
        return res.status(200).send({
          success: true,
          status_code: 200,
          message: "Data found",
          data: result.rows,
        });
      }
    });
  });

  app.get("/api/criteria/:id", (req, res) => {
    const { id } = req.params;

    const query = `select * from m_criteria where id = ${id}`;

    pool.query(query, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      } else {
        return res.status(200).send({
          success: true,
          status_code: 200,
          message: "Data Found",
          data: result.rows[0],
        });
      }
    });
  });

  app.post("/api/criteria", (req, res) => {
    const { name, description, alternative_id, attribut } = req.body;

    const query = `insert into m_criteria (name, description, type, alternative_id, attribut)
    values('${name}', '${description}', null, ${alternative_id}, '${attribut}')`;

    pool.query(query, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      } else {
        return res.status(201).send({
          success: true,
          status_code: 201,
          message: "Data Added successfully",
          data: null,
        });
      }
    });
  });

  app.put("/api/criteria/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, alternative_id, attribut } = req.body;

    const query = `update m_criteria set name = '${name}',
                    description = '${description}',
                    alternative_id = ${alternative_id},
                    attribut = '${attribut}'
                    where id = ${id}`;

    pool.query(query, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      } else {
        return res.status(200).send({
          success: true,
          status_code: 200,
          message: "Data Update Success",
          data: null,
        });
      }
    });
  });

  app.delete("/api/criteria/:id", (req, res) => {
    const { id } = req.params;

    const query = `delete from m_criteria where id = ${id}`;

    pool.query(query, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      } else {
        return res.status(200).send({
          success: true,
          status_code: 200,
          message: "Data Deleted successfully",
          data: null,
        });
      }
    });
  });

  //--------------------------- TOPSIS METHOD -------------------------
  app.post("/api/decision", (req, res) => {
    const { listDecision } = req.body;

    var detailQuery = "";
    listDecision.forEach((data) => {
      detailQuery += detailQuery.length > 0 ? "," : "";
      detailQuery += `(${data.point}, ${data.criteria_id}, ${data.guest_id})`;
    });

    const advancedQuery = `insert into m_decision (point, criteria_id, guest_id)
            values ${detailQuery}`;

    pool.query(advancedQuery, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      } else {
        return res.status(200).send({
          success: true,
          status_code: 200,
          message: "Success send Answer",
          data: null,
        });
      }
    });
  });

  app.get("/api/point", (req, res) => {
    const query = `select * from m_point`;

    pool.query(query, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      } else {
        return res.status(200).send({
          success: true,
          status_code: 200,
          message: "Data Found",
          data: result.rows,
        });
      }
    });
  });
};
