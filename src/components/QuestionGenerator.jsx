import { useState, useEffect } from 'react';
import axios from 'axios';

function QuestionGenerator() {
    const [difficulty, setDifficulty] = useState('BASIC');
    const [parentTopics, setParentTopics] = useState([]);
    const [subTopics, setSubTopics]     = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');
    const [generatedQuestion, setGeneratedQuestion] = useState(null);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/topics?parentId=null');
                setParentTopics(response.data);
            } catch (error) {
                console.error('Failed to fetch parent topics', error);
            }
        };
        fetchParents();
    }, []);

    useEffect(() => {
        const fetchSubTopics = async () => {
            if (!selectedParent) {
                setSubTopics([]);
                setSelectedSubtopic('');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8080/api/topics?parentId=${selectedParent}`);
                setSubTopics(response.data);
            } catch (error) {
                console.error('Failed to fetch subtopics', error);
            }
        };
        fetchSubTopics();
    }, [selectedParent]);

    const handleGenerate = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/questions/generate', {
                topicId: selectedSubtopic ? parseInt(selectedSubtopic) : null,
                difficultyLevel: difficulty
            });
            setGeneratedQuestion(response.data);
            console.log(response.data);
        } catch (err) {
            console.error('Failed to generate question', err);
        }
    };

    return (
        <div>
            <h2>Generate a Question</h2>
            <div>
                <label>Parent Topic: </label>
                <select
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                >
                    <option value="">-- Select Parent --</option>
                    {parentTopics.map(topic => (
                        <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Subtopic: </label>
                <select
                    value={selectedSubtopic}
                    onChange={(e) => setSelectedSubtopic(e.target.value)}
                    disabled={!selectedParent}
                >
                    <option value="">-- Select Subtopic --</option>
                    {subTopics.map(topic => (
                        <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Difficulty: </label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="BASIC">BASIC</option>
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="ADVANCED">ADVANCED</option>
                </select>
            </div>

            <button onClick={handleGenerate}>Generate</button>

            {generatedQuestion && (
                <div style={{ marginTop: 20 }}>
                    <p><strong>Question ID:</strong> {generatedQuestion.id}</p>
                    <p><strong>Question Text:</strong> {generatedQuestion.questionText}</p>
                    <p><strong>Difficulty:</strong> {generatedQuestion.difficultyLevel}</p>
                </div>
            )}
        </div>
    );
}

export default QuestionGenerator;
