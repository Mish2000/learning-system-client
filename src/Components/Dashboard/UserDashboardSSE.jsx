import {useEffect, useState} from 'react';
import {Box, ImageList, ImageListItem} from "@mui/material";
import ChartTotalSuccessRate from "../Statistics/ChartTotalSuccessRate.jsx";
import ChartSuccessRateByTopic from "../Statistics/ChartSuccessRateByTopic.jsx";


function UserDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);

    const data =
        [
            {month: "Jan", avgTemp: 2.3, iceCreamSales: 162000},
            {month: "Mar", avgTemp: 6.3, iceCreamSales: 302000},
            {month: "May", avgTemp: 16.2, iceCreamSales: 800000},
            {month: "Jul", avgTemp: 22.8, iceCreamSales: 1254000},
            {month: "Sep", avgTemp: 14.5, iceCreamSales: 950000},
            {month: "Nov", avgTemp: 8.9, iceCreamSales: 200000},
        ]


    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        const source = new EventSource(`http://localhost:8080/api/sse/user-dashboard?token=${token}`);
        source.addEventListener('userDashboard', event => {
            setDashboardData(JSON.parse(event.data));
        });
        source.onerror = () => {
            source.close();
        };
        return () => {
            source.close();
        };
    }, []);

    // if (!dashboardData) {
    //     return <div>Loading user dashboard ...</div>;
    // }


    return (
        <Box >
            <ImageList cols={6}   rowHeight={280}
                        sx={{width: "100%", height: "100%", overflow: 'clip'}}>
                <ImageListItem cols={2} rows={1}>
                    <ChartSuccessRateByTopic topic={"math"} data={data}/>
                </ImageListItem>

                <ImageListItem   cols={2} rows={2}>
                    <ChartTotalSuccessRate data={data}/>
                </ImageListItem>

                <ImageListItem cols={2} rows={1}>
                    <ChartTotalSuccessRate data={data}/>
                </ImageListItem>

                <ImageListItem cols={2} rows={1}>
                    <ChartTotalSuccessRate data={data}/>
                </ImageListItem>

                <ImageListItem cols={2} rows={1}>
                    <ChartTotalSuccessRate data={data}/>
                </ImageListItem>

            </ImageList>
        </Box>

    );
}

export default UserDashboardSSE;


