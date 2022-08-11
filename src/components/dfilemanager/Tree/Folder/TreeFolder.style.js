import styled from "styled-components/macro";

export const StyledFolder = styled.section`
  font-weight: bold;
  padding-right: ${(p) => p.theme.indent}px;
  .tree__file {
    padding-right: ${(p) => p.theme.indent}px;
  }
`;
