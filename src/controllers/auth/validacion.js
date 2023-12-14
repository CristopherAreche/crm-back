const { Salesman, Boss } = require("../../db.js");
const jwt = require("jsonwebtoken");
const updateBoss = require("../Bosses/updateBoss.js");

module.exports = async (data) => {
  const { myToken } = data;
  if (!myToken) {
    return false;
  }
  const secret = "secret";
  try {
    var decodificacion = jwt.verify(myToken, secret);
  } catch (error) {
    return false;
  }
  const { id, email, password, pay_day, createdAt } = decodificacion;

  if (pay_day == null) {
    let endFree = new Date(createdAt);
    // console.log('Soy el createdAt', endFree);
    endFree.setDate(endFree.getDate() + 6);
    // console.log('Soy el endFree', endFree);
    const now = new Date();
    // console.log('Now', now);
    if (now > endFree) {
      let data = { id: id, enable: false }
      await updateBoss(data)
      return false;
    }

  } else {
    let fecha = new Date(pay_day);
    console.log('fecha', fecha);
    const now = new Date()
    if (now > fecha) {
      let data = { id: id, enable: false }
      await updateBoss(data)
      return false;
    }

  }

  let salesman = await Salesman.findOne({ where: { email: email } });
  if (salesman !== null) {
    if (password !== null) {
      if (password === salesman.dataValues["password"]) {
        return salesman.salesman.dataValues;
      }
    }
  }
  let boss = await Boss.findOne({ where: { email: email } });
  if (boss !== null) {
    if (password !== null) {
      if (password === boss.dataValues.password) {
        return boss.dataValues;
      }
    }
  }

  //   if (nickname) {
  //     let boss = await createBoss({ name, username: nickname, email, password });
  //     return createToken(boss, 'admin')
  //   }
};
