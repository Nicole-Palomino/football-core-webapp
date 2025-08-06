import React from 'react'
import PieArcLabel from './PieArcLabel'

const PieChartsOne = ({ Data, title }) => {
    return (
        <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 bg-target rounded-lg p-6 shadow-lg">
            <PieArcLabel data={Data} title={title} />
        </div>
    )
}

export default PieChartsOne