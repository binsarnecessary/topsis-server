module.exports = exports = (app, pool) => {
  app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    const checkEmail = `select * from m_user where email = '${email}'`;

    pool.query(checkEmail, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      }

      const emailFound = result.rowCount;
      if (emailFound === 0) {
        return res.status(200).send({
          success: false,
          status_code: 400,
          message:
            "Anda Bukan Admin. Hubungin Admin untuk mengakses Halaman ini",
          data: null,
        });
      }

      const passwordMatch = result.rows[0].password;
      if (password != passwordMatch) {
        return res.status(200).send({
          success: false,
          status_code: 400,
          message: "Password does not match",
          data: null,
        });
      } else {
        return res.status(200).send({
          success: true,
          status_code: 200,
          message: "Login successful",
          data: result.rows[0],
        });
      }
    });
  });

  app.get("/auth/user", (req, res) => {
    const query = `select max(guest_id) from m_decision`

    pool.query(query, (error, result) => {
      if(error) {
        return res.status(400).send({
          success: false,
          data: error
        })
      } else {
        return res.status(200).send({
          success: true,
          staus_code: 200,
          message: "Data Found",
          data: result.rows[0]
        })
      }
    })
  })
};
