import styled from "styled-components/macro";

export const StyledTree = styled.div`
  line-height: 1.75;
  z-index: 1;
  direction: rtl;
  .tree__input {
    width: auto;
  }
`;

export const ActionsWrapper = styled.div`
  position: revert;
  width: max-content;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  flex-direction: column;
  z-index: 1000;
  background-color: #3f6791;
  color: #f5f5f5;
  padding:10px;
  border-radius: 6px 24px;
  top: 15px;
  right: 15px;
  padding-right: 10px;
  .actiondiv {
    margin-bottom: 10px;
    display: flex;
    justify-content:start;
    cursor: pointer;
    transition: 0.2s;
    :hover {
      
      transform: scale(1.1);
    }
  }
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: center;
    pointer-events: none;
    transition: 0.2s;
    flex-direction: column;
     svg {
      width:25%
      margin-left: 10px;
      transform: scale(1);
      transition: 0.2s;
      :hover {
        transform: scale(1.1);
      }
    }
  }

  &:hover .actions {
    pointer-events: all;
    transition: 0.2s;
  }
`;

export const StyledName = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Collapse = styled.div`
  height: max-content;
  max-height: ${(p) => (p.isOpen ? "auto" : "0px")};
  overflow: auto;
  transition: 0.5s ease-in-out;
`;
