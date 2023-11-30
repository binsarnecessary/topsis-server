module.exports = exports = (app, pool) => {
  app.get("/api/news", (req, res) => {
    const query = `select * from m_news`;

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

  app.get("/api/news/:id", (req, res) => {
    const { id } = req.params;
    const query = `select * from m_news where id = ${id}`;

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

  app.post("/api/news", (req, res) => {
    const { thumbnail, headline, main } = req.body;

    const query = `insert into m_news (thumbnail, headline, isi_berita)
                    values('${thumbnail}', '${headline}', '${main}')`;

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
          message: `Data Added ${headline}`,
          data: null,
        });
      }
    });
  });

  app.put("/api/news/:id", (req, res) => {
    const { id } = req.params;
    const { thumbnail, headline, isi_berita } = req.body;

    const query = `update m_news set headline = '${headline}',
                    thumbnail = '${thumbnail}', isi_berita = '${isi_berita}' where id = ${id};`;
    console.log(query);
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
          message: "Updated Successfully",
          data: null,
        });
      }
    });
  });

  app.delete("/api/news/:id", (req, res) => {
    const { id } = req.params;

    const query = `delete from m_news where id = ${id}`;

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
          message: "Data Successfully Deleted",
          data: null,
        });
      }
    });
  });
};
