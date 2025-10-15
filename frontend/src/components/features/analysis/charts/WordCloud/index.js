// Legacy Carbon Charts example - kept for reference
// This file is replaced by the new WordCloud.tsx component
// 
// Attribution: IBM Carbon Charts
// Original example from: https://github.com/carbon-design-system/carbon-charts

import React from 'react'
import ReactDOM from 'react-dom/client'
import { WordCloudChart } from '@carbon/charts-react'
import data from './data.js'
import options from './options.js'
import '@carbon/charts-react/styles.css'

class CarbonWordCloudExample extends React.Component {
  state = {
    data,
    options,
  }

  render = () => (
    <WordCloudChart
      data={this.state.data}
      options={this.state.options}
    />
  )
}

// This is kept for reference but not used in the application
export default CarbonWordCloudExample