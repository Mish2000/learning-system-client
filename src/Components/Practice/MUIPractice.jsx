import  {useState} from 'react';
import {Button, TextField} from "@mui/material";
import axios from "axios";

function MuiPractice() {
const [question, setQuestion] = useState({});
    const handleGenerate = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/questions/generate', {
                topicId: 2,
                difficultyLevel: "EASY"
            });
         setQuestion(response.data)
            console.log(response.data);
        } catch (err) {
            console.error('Failed to generate question', err);
        }
    };
    return (
        <>
        <Button onClick={()=> handleGenerate()}>generate</Button>
            {question.questionText}
            <TextField variant="outlined" />

        </>
    );
}

export default MuiPractice;