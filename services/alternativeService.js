module.exports = exports = (app, pool) => {
  app.get("/api/alternative", (req, res) => {
    const query = `select * from m_alternative`;

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

  app.get("/api/alternative/:id", (req, res) => {
    const { id } = req.params;

    const query = `select * from m_alternative where id = ${id}`;

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

  app.post("/api/alternative", (req, res) => {
    const { code, name, description, image } = req.body;

    const query = `insert into m_alternative (code, name, description, image)
        values ('${code}', '${name}', '${description}', '${image}')`;

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
          message: "Data Successfully Added",
          data: {
            code: code,
            name: name,
            description: description,
            image: image,
          },
        });
      }
    });
  });

  app.delete("/api/alternative/:id", (req, res) => {
    const { id } = req.params;

    const query = `delete from m_alternative where id = ${id}`;

    pool.query(query, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: true,
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

  app.put("/api/alternative/:id", (req, res) => {
    const { id } = req.params;
    const { code, name, description, image } = req.body;

    const query = `update m_alternative set code = '${code}',
                    name = '${name}',
                    description = '${description}',
                    image = '${image}'
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
          message: "Data Updated Success",
          data: {
            code: code,
            name: name,
            description: description,
            image: image,
          },
        });
      }
    });
  });
};
