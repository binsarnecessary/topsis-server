module.exports = exports = (app, pool) => {
  app.get("/api/topsis/:guestId", (req, res) => {
    const { guestId } = req.params;
    var decision;

    const query = `select md.point, ma.id, mc.attribut
                        from m_alternative ma
                        join m_criteria mc
                        on ma.id = mc.alternative_id
                        join m_decision md 
                        on md.criteria_id = mc.id
                        where md.guest_id = ${guestId}
                        order by md.id`;
    pool.query(query, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      }

      var getData = result.rowCount;
      if (getData === 0) {
        return res.status(200).send({
          success: false,
          status_code: 400,
          message: "Data not found",
          data: null,
        });
      }

      decision = result.rows;
      var type = [];

      for (var i = 0; i < 5; i++) {
        type[i] = result.rows[i].attribut;
      }

      const groupedData = {};
      decision.forEach((row) => {
        const id = row.id;
        if (!groupedData[id]) {
          groupedData[id] = [];
        }
        groupedData[id].push(row.point);
      });

      // Mengonversi objek menjadi matriks
      const matrix = Object.values(groupedData);

      // Bobot kriteria
      const weights = [5, 3, 4, 2, 2];

      // Lanjutkan dengan perhitunga  TOPSIS
      const normalizedMatrix = normalizeMatrix(matrix);
      const topsisScores = calculateTOPSIS(normalizedMatrix, weights, type);

      // Membuat respons yang berisi ID dan nilai TOPSIS
      const resultTopsis = [];
      for (let i = 0; i < topsisScores.length; i++) {
        resultTopsis.push({
          id: i + 1,
          topsisScore: Number(topsisScores[i].toFixed(4)),
        });
      }

      resultTopsis.sort((a, b) => b.topsisScore - a.topsisScore);

      res.status(200).send({
        success: true,
        data: resultTopsis[0],
      });
    });
  });

  app.get("/api/topsis/", (req, res) => {
    var decision;

    const query = `select md.point, ma.id, mc.attribut
                        from m_alternative ma
                        join m_criteria mc
                        on ma.id = mc.alternative_id
                        join m_decision md 
                        on md.criteria_id = mc.id
                        order by md.id`;
    pool.query(query, (error, result) => {
      if (error) {
        return res.status(400).send({
          success: false,
          data: error,
        });
      }

      var getData = result.rowCount;
      if (getData === 0) {
        return res.status(200).send({
          success: false,
          status_code: 400,
          message: "Data not found",
          data: null,
        });
      }

      decision = result.rows;
      var type = [];

      for (var i = 0; i < 5; i++) {
        type[i] = result.rows[i].attribut;
      }

      const groupedData = {};
      decision.forEach((row) => {
        const id = row.id;
        if (!groupedData[id]) {
          groupedData[id] = [];
        }
        groupedData[id].push(row.point);
      });

      // Mengonversi objek menjadi matriks
      const matrix = Object.values(groupedData);

      // Bobot kriteria
      const weights = [5, 3, 4, 2, 2];

      // Lanjutkan dengan perhitunga  TOPSIS
      const normalizedMatrix = normalizeMatrix(matrix);
      const topsisScores = calculateTOPSIS(normalizedMatrix, weights, type);

      // Membuat respons yang berisi ID dan nilai TOPSIS
      const resultTopsis = [];
      for (let i = 0; i < topsisScores.length; i++) {
        resultTopsis.push({
          id: i + 1,
          topsisScore: Number(topsisScores[i].toFixed(4)),
        });
      }

      resultTopsis.sort((a, b) => b.topsisScore - a.topsisScore);

      res.status(200).send({
        success: true,
        data: resultTopsis[0],
      });
    });
  });


  function normalizeMatrix(matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    const normalizedMatrix = [];

    for (let j = 0; j < numCols; j++) {
      const col = matrix.map((row) => row[j]);
      const sumOfSquares = col.reduce((acc, value) => acc + value ** 2, 0);
      const normalizationFactor = Math.sqrt(sumOfSquares);
      const normalizedCol = col.map((value) => value / normalizationFactor);

      for (let i = 0; i < numRows; i++) {
        if (!normalizedMatrix[i]) {
          normalizedMatrix[i] = [];
        }
        normalizedMatrix[i][j] = normalizedCol[i];
      }
    }

    return normalizedMatrix;
  }

  function calculateTOPSIS(matrix, weights, costType) {
    const n = matrix.length;
    const m = matrix[0].length;
    var CheckMax = 0;
    var CheckMin = 1;

    // Calculate A+ (ideal positive solution) and A- (ideal negative solution)
    const Ap = new Array(m).fill(Number.MIN_VALUE); // Inisialisasi dengan nilai yang sangat rendah
    const An = new Array(m).fill(Number.MAX_VALUE); // Inisialisasi dengan nilai yang sangat tinggi

    for (let j = 0; j < m; j++) {
      if (j >= 3) {
        CheckMax = 1;
        CheckMin = 0;
      } else {
        CheckMax = 0;
        CheckMin = 1;
      }
      for (let i = 0; i < n; i++) {
        const weightedValue = Number((matrix[i][j] * weights[j]).toFixed(4)); // Menerapkan bobot pada nilai ternormalisasi
        // console.log("weighted", i, j, weightedValue);
        if (costType[j] === "cost") {
          if (weightedValue < CheckMax) {
            CheckMax = weightedValue;
          } else if (weightedValue > CheckMin) {
            CheckMin = weightedValue;
          }

          // console.log(CheckMax)
          // console.log(CheckMin)
        } else {
          if (weightedValue > CheckMax) {
            CheckMax = weightedValue;
          } else if (weightedValue < CheckMin) {
            CheckMin = weightedValue;
          }

          // console.log(CheckMax)
          // console.log(CheckMin)
        }
        Ap[j] = CheckMax;
        An[j] = CheckMin;
      }
    }
    console.log(Ap);
    console.log(An);

    // Calculate the Euclidean distance to A+ and A- for each alternative
    const distanceToAp = [];
    const distanceToAn = [];
    for (let i = 0; i < n; i++) {
      let sumDistanceToAp = 0;
      let sumDistanceToAn = 0;
      for (let j = 0; j < m; j++) {
        const weightedValue = matrix[i][j] * weights[j]; // Menerapkan bobot pada nilai ternormalisasi
        sumDistanceToAp += (Ap[j] - weightedValue) ** 2;
        sumDistanceToAn += (weightedValue - An[j]) ** 2;
      }
      distanceToAp.push(Math.sqrt(sumDistanceToAp));
      distanceToAn.push(Math.sqrt(sumDistanceToAn));
    }

    // Calculate the TOPSIS score for each alternative
    const topsisScores = [];
    for (let i = 0; i < n; i++) {
      const score = distanceToAn[i] / (distanceToAn[i] + distanceToAp[i]);
      topsisScores.push(score);
    }

    return topsisScores;
  }
};
