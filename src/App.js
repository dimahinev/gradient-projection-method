import React, { useState } from 'react';
import './App.css';
import { Helmet } from 'react-helmet'




function App() {

  let { create, all } = require('mathjs')

  const math = create(all, {})

  function grad(R, U0) {

    // производная по u1
    let u1Der = math.derivative(R, 'u1')
    u1Der = math.evaluate(u1Der.toString(), U0)

    // производная по u2
    let u2Der = math.derivative(R, 'u2')
    u2Der = math.evaluate(u2Der.toString(), U0)


    return { u1: u1Der, u2: u2Der }
  }

  let preInit = {
    R: `(3-2*u1)^2 + (u1-3*u2)^2-2*u1-4*u2`,
    U: {
      u1: {
        min: -8,
        max: 14
      },
      u2: {
        min: -9,
        max: 11
      },
    },
    U0: {
      u1: -5,
      u2: 5
    },

    Hk: (k) => (1 / (k + 1)),
    K: {
      min: 0,
      max: 1800
    },
    E: `10^(-4)`,
    Int: 5,
  }
  const [value, setValue] = useState(preInit)
  const [result, setResult] = useState([])
  let error = false

  function handleChange(event) {

    let tmpInitObj = Object.assign({}, value)

    switch (event.target.name) {
      case "R":
        tmpInitObj.R = event.target.value

        break
      case "u1[min]":
        tmpInitObj.U.u1.min = event.target.value
        break

      case "u1[max]":
        tmpInitObj.U.u1.max = event.target.value
        break

      case "u2[min]":
        tmpInitObj.U.u2.min = event.target.value
        break
      case "u2[max]":
        tmpInitObj.U.u2.max = event.target.value
        break

      case "U0[u1]":
        tmpInitObj.U0.u1 = event.target.value
        break
      case "U0[u2]":
        tmpInitObj.U0.u2 = event.target.value
        break

      case "K[min]":
        tmpInitObj.K.min = event.target.value
        break
      case "K[max]":
        tmpInitObj.K.max = event.target.value
        break
      case "E":
        tmpInitObj.E = event.target.value
        break
      case "Int":
        tmpInitObj.Int = event.target.value
        break
    }
    setValue(tmpInitObj)
  }

  function calculate() {

    try {
      if (value.R === "") {
        throw TypeError('R is empty')
      }
      if (value.U.u1.min === "") {
        throw TypeError('u1[min] is empty')
      }
      if (value.U.u1.max === "") {
        throw TypeError('u1[max] is empty')
      } if (value.U.u2.min === "") {
        throw TypeError('u2[min] is empty')
      } if (value.U.u2.max === "") {
        throw TypeError('u2[max] is empty')
      }
      if (value.U0.u1 === "") {
        throw TypeError('U0[u1] is empty')
      }
      if (value.U0.u2 === "") {
        throw TypeError('U0[u2] is empty')
      }
      if (value.K.min === "") {
        throw TypeError('K[min] is empty')
      }
      if (value.K.max === "") {
        throw TypeError('K[max] is empty')
      }
      if (value.E === "") {
        throw TypeError('E is empty')
      }
      if (value.Int === "") {
        throw TypeError('Int is empty')
      }


      let U0 = value.U0
      let y0, g0, g0Mod
      let RU0
      let resultArr = []
      //                          1800             5
      for (let k = 0; k <= value.K.max; k++) {



        // R(u1, u2)
        RU0 = math.evaluate(value.R, {
          u1: U0.u1,
          u2: U0.u2
        })

        if (k % value.Int === 0) {
          resultArr.push({ k, U0, RU0 })
        }

        // gradR(U0)
        g0 = grad(value.R, U0)

        // |g0|
        g0Mod = math.evaluate(`sqrt((${g0.u1})^2 + (${g0.u2})^2)`)

        // |g0| <= E
        if (g0Mod <= math.evaluate(value.E)) {
          resultArr.push({ k, U0, RU0 })
          setResult(resultArr)
          break
        }

        // y0 = u0 - (h0 * g0)
        y0 = {
          u1: U0.u1 - (value.Hk(k) * g0.u1),
          u2: U0.u2 - (value.Hk(k) * g0.u2),
        }

        // U1 = Pv (y0)
        U0 = {
          u1: (y0.u1 >= value.U.u1.min) && (y0.u1 <= value.U.u1.max) ? y0.u1 : ((y0.u1 <= value.U.u1.min) ? value.U.u1.min : value.U.u1.max),
          u2: (y0.u2 >= value.U.u2.min) && (y0.u2 <= value.U.u2.max) ? y0.u2 : ((y0.u2 <= value.U.u2.min) ? value.U.u2.min : value.U.u2.max)
        }

      }
    }

    catch { }

  }

  function handleSubmit(event) {
    event.preventDefault();

    try {
      if (!error) {
        calculate()
      }
    } catch { }
  }

  function Result() {
    const isCalculated = JSON.stringify(result) != "{}"
    try {
      if (value.R === "") {
        throw TypeError('R is empty')
      }
      if (value.U.u1.min === "") {
        throw TypeError('u1[min] is empty')
      }
      if (value.U.u1.max === "") {
        throw TypeError('u1[max] is empty')
      } if (value.U.u2.min === "") {
        throw TypeError('u2[min] is empty')
      } if (value.U.u2.max === "") {
        throw TypeError('u2[max] is empty')
      }
      if (value.U0.u1 === "") {
        throw TypeError('U0[u1] is empty')
      }
      if (value.U0.u2 === "") {
        throw TypeError('U0[u2] is empty')
      }
      if (value.K.min === "") {
        throw TypeError('K[min] is empty')
      }
      if (value.K.max === "") {
        throw TypeError('K[max] is empty')
      }
      if (value.E === "") {
        throw TypeError('E is empty')
      }
      if (value.Int === "") {
        throw TypeError('Int is empty')
      }
      if (isNaN(Number(value.U.u1.min))) {
        throw TypeError('u1[min] is not a Number')
      }
      if (isNaN(Number(value.U.u1.max))) {
        throw TypeError('u1[max] is not a Number')
      }
      if (isNaN(Number(value.U.u2.min))) {
        throw TypeError('u2[min] is not a Number')
      }
      if (isNaN(Number(value.U.u2.max))) {
        throw TypeError('u2[max] is not a Number')
      }
      if (isNaN(Number(value.U0.u1))) {
        throw TypeError('U0[u1] is not a Number')
      }
      if (isNaN(Number(value.U0.u2))) {
        throw TypeError('U0[u2] is not a Number')
      }
      if (isNaN(Number(value.K.min))) {
        throw TypeError('K[min] is not a Number')
      }
      if (isNaN(Number(value.K.max))) {
        throw TypeError('K[max] is not a Number')
      }
      if (isNaN(Number(value.Int))) {
        throw TypeError('Int is not a Number')
      }
      if (isCalculated) {
        let tmp = ''
        for (let i = 0; i < result.length; i++) {
          if (i == result.length - 1) {
            tmp += `
            <b>Result </b>
          `
          }
          tmp += `
          <h1>k = ${result[i].k}</h1> 
          <h1>U[${result[i].k}] = ( ${Math.round((result[i].U0.u1 + Number.EPSILON) * 10000) / 10000}, ${Math.round((result[i].U0.u2 + Number.EPSILON) * 100) / 100} ) </h1>
          <h1>R[${result[i].k}] = ${Math.round((result[i].RU0 + Number.EPSILON) * 100) / 100} </h1>
          <br/>
          `
        }

        return {
          __html:
            tmp
        }
      }
    }
    catch (e) {
      error = true
      if (e instanceof TypeError) {
        return { __html: `<h1 id="error-message" > ${e.message}</h1>` }
      }
      else {
        return { __html: "<h1>Enter correct formula</h1>" }
      }
    }
  }

  function handleFormReset() {
    setValue(
      {
        R: ``,
        U: {
          u1: {
            min: '',
            max: ''
          },
          u2: {
            min: '',
            max: ''
          },
        },
        U0: {
          u1: '',
          u2: ''
        },

        Hk: (k) => (1 / (k + 1)),
        K: {
          min: '',
          max: ''
        },
        E: ``,
        Int: '',
      }
    )
  }


  return (
    <div className="App">
      <Helmet>
        <title>Gradient Projection Method</title>
      </Helmet>
      <form id="input-form" onSubmit={handleSubmit}>

        <div className="label-wrapper">
          <label>
            R:
            <input type="text" name="R" value={value.R} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            u1[min]:
          <input type="text" name="u1[min]" value={value.U.u1.min} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            u1[max]:
          <input type="text" name="u1[max]" value={value.U.u1.max} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            u2[min]:
          <input type="text" name="u2[min]" value={value.U.u2.min} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            u2[max]:
          <input type="text" name="u2[max]" value={value.U.u2.max} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            U0[u1]:
          <input type="text" name="U0[u1]" value={value.U0.u1} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            U0[u2]:
          <input type="text" name="U0[u2]" value={value.U0.u2} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            K[min]:
          <input type="text" name="K[min]" value={value.K.min} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            K[max]:
          <input type="text" name="K[max]" value={value.K.max} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            E:
          <input type="text" name="E" value={value.E} onChange={handleChange} />
          </label>
        </div>

        <div className="label-wrapper">
          <label>
            Int:
          <input type="text" name="Int" value={value.Int} onChange={handleChange} />
          </label>
        </div>

        <button className="submit" id="reset" onClick={handleFormReset}>Reset</button>

        <input className="submit" id="input-submit" type="submit" value="Calculate" />

      </form>

      <div id="result" dangerouslySetInnerHTML={Result()}></div>
    </div>
  );
}

export default App;

