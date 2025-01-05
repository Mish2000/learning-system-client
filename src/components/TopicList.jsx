import  { useEffect, useState } from 'react';
import axios from 'axios';

function TopicList() {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/topics');
                setTopics(response.data);
            } catch (error) {
                console.error('Failed to fetch topics', error);
            }
        };
        fetchTopics();
    }, []);

    return (
        <div>
            <h2>All Topics</h2>
            <ul>
                {topics.map(topic => (
                    <li key={topic.id}>
                        <strong>{topic.name}</strong> - {topic.description}
                        <em> (Difficulty: {topic.difficultyLevel})</em>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopicList;
