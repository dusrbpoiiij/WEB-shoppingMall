import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {

  const [Checked, setChecked] = useState([]);  // [1,2,3] : 예시

  const handleToggle = (value) => {
    // 누른 것의 Index를 구하고 
    const currentIndex = Checked.indexOf(value);

    // 전체 Check된 State에서 현재 누른 Checkbox가 이미 있다면 
    const newChecked = [...Checked]

    // State에 넣어준다.
    if(currentIndex === -1) {
      newChecked.push(value);
    // 빼준다.
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
  }

  const renderCheckboxList = () => props.list && props.list.map((value, index) => (
    <React.Fragment key={index}>
      <Checkbox onChange={() => handleToggle(value._id)} 
                checked={Checked.indexOf(value._id) === -1 ? false : true} />
        <span>{value.name}</span>
    </React.Fragment>
  ))
  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Continents" key="1">
          {renderCheckboxList()}
        </Panel>
      </Collapse>
    </div>
  )
}

export default CheckBox