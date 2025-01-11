import React, {useState} from 'react';
import {AgCharts} from "ag-charts-react";
import PropTypes from "prop-types";


ChartSuccessRateByTopic.propTypes = {
    data: PropTypes.array.isRequired,
    topic: PropTypes.string.isRequired,
};
function ChartSuccessRateByTopic(props) {
    const options={
        theme: "ag-polychroma",
        title: { text: 'Success Rate By Topic' },
        subtitle: { text: props.topic },
        data: props.data,
        series: [{ type: "pie", angleKey: 'avgTemp', legendItemKey:"month",  sectorLabelKey: 'avgTemp', sectorLabel: {
                color: 'white',
                fontWeight: 'bold',
            }, }],
        legend: {
            toggleSeries: false,
            position: "top",
            item: {
                maxWidth: 130,
                paddingX: 20,
                paddingY: 8,
                marker: {
                    padding: 8,
                }
            }
        },
    }



    return (
        <>
            <AgCharts  style={{width: "100%", height: "100%" }} options={options} />
        </>


    );
}

export default ChartSuccessRateByTopic;
