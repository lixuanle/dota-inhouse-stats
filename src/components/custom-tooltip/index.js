import styled from "styled-components";

import { heroLegend, pictureLegend } from "../../util/legends";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { payload: { heroName } } = payload[0];
    return (
      <div>
        <p>{heroLegend[heroName]}</p>
        <HeroIcon src={`${pictureLegend[heroName]}`} alt={`${heroName} icon`} />
      </div>
    );
  }
  return null;
}

export default CustomTooltip;

const HeroIcon = styled.img`
  height: 48px;
`