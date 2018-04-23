const withStyle = (style) => (storyFunction) => (
  <div style={style}>
    {storyFunction()}
  </div>
);

export default withStyle;