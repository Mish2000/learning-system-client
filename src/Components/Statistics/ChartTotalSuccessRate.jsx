import React, {useState} from 'react';
import {AgCharts} from "ag-charts-react";
import PropTypes from "prop-types";


ChartTotalSuccessRate.propTypes = {
    data: PropTypes.array.isRequired,
};
function ChartTotalSuccessRate(props) {
    const options={
        theme: "ag-polychroma",
        title: { text: 'Success Rate' },
        subtitle: { text: 'All subjects' },
        data: props.data,
        series: [{ type: "pie", angleKey: 'avgTemp', legendItemKey:"month",  sectorLabelKey: 'avgTemp', sectorLabel: {
                color: 'white',
                fontWeight: 'bold',
            }, }],
    }



    return (
        <>
                <AgCharts  style={{width: "100%", height: "100%" }} options={options} />
        </>


);
}

export default ChartTotalSuccessRate;
