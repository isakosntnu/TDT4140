// MyComponent.tsx
import React, { useState } from 'react';
import { styled } from '@mui/system';

const StyledDiv = styled('div')({
  backgroundColor: '#8E2DE2'
});

function StyledBackground() {
  const [backgroundColor, setBackgroundColor] = useState<string>('#8E2DE2');

}

export default StyledBackground;