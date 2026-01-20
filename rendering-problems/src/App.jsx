import { Children, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProblematicParent from './simple/first-problem/index.jsx'
import SecondProblem from './simple/second-problem/solution.jsx'
import ThirdProblem from './simple/third-problem/solution.jsx'
import FourthProblem from './simple/fourth-problem/solution.jsx'
import ChildrenAsProp from './childAsProp/index.jsx'
import { CircleCounter } from './renderProp/circle.jsx'
import { RectangleCounter } from './renderProp/rectangule.jsx'
import { WithToggle } from './hoc/toggle.jsx'
import Modal from './hoc/modal.jsx'
function App() {
  const [count, setCount] = useState(0)
// ENVOLVEMOS los componentes con el HOC
const ModalWithToggle = WithToggle(Modal);
  return (
    <>
     {/* <ProblematicParent /> */}
     {/* <SecondProblem /> */}
     {/* <ThirdProblem/> */}
     {/* <FourthProblem/> */}
    <ChildrenAsProp/>

    <ModalWithToggle>
      
    </ModalWithToggle>
    </>
  )
}

export default App
