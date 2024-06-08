import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";


const QuestionEditor = ({
  index = 0,
  question,
  addQuestion,
  deleteQuestion,
  questionChange,
}) => {
     const [model, setModel] = useState({...question})
     const {questionTypes}= useStateContext()

     function upperCaseFirst(str){
        return str.chatAt(0).toUpperCase() +str.slice(1)
     }
     
  return <div></div>;
};

export default QuestionEditor;
