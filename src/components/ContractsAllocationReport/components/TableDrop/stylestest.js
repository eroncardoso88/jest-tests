import styled from 'styled-components';
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: auto;
  overflow-y: hidden;

  .title-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
`;
export const Table = styled.table`
  border-collapse: collapse;
  display: flex;
  flex-direction: column;
  border-spacing: 0;

  flex: 1;
  width: 100%;
`;
export const Thead = styled.th`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const Tr = styled.tr`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 55px;
  cursor: pointer;
  color: #fff;
  padding-left: 10px;
  background-color: #009688;

  border-radius: 5px;
  width: 100%;

  svg {
    color: #fff;
  }
  :hover {
    background-color: #23a09a;
  }
  #estado-nome {
    width: 250px;
  }
`;

export const Th = styled.th`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;

  .filter-input {
    width: 150px;
    height: 50px;
  }
`;

export const Tbody = styled.tbody`
  display: flex;
  flex-direction: row;

  flex-direction: column;
  .trBody {
    display: flex;
    flex-direction: row;
    background-color: #fff;
    color: #333;

    justify-content: flex-start;
    border-bottom: 1px solid #ddd;
  }
  #nome {
  }
`;

export const Td = styled.td`
  color: #333;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  justify-content: space-between;

  span {
    width: 305px;
    padding-left: 55px;
    font-weight: bold;
  }
`;
