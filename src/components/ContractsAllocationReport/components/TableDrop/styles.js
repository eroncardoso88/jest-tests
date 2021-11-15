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

  .title-toolbar-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin: 20px 0;

    > button {
      margin-right: 15px;
    }
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

  .header {
    height: 75px;
    background-color: transparent;
    color: #333;
    :hover {
      background-color: transparent;
    }
    .filter-input {
      width: 150px;
      padding: 0px 10px 10px 0px;
    }

    .filter-input-icms {
      width: 168px;
      padding: 0px 10px 10px 0px;
    }
  }

  .usina-container {
    .usina-span {
      text-align: center;

      font-size: 13px;
      color: #009688;
    }
    .usina-p {
      text-align: center;

      font-size: 12px;
      color: #c4c4c4;
    }
  }
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
  #estado-nome2 {
    color: transparent;
    width: 250px;
  }
  #estado-nome3 {
    width: 330px;
  }
  .icon-button-header {
    svg {
      color: transparent;
      cursor: unset;

      :hover {
        background-color: transparent !important;
      }
    }
  }
`;

export const Th = styled.th`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-left: 5px;

  width: 155px;
`;

export const Tbody = styled.tbody`
  display: flex;

  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  .trBody {
    display: flex;
    flex-direction: row;
    background-color: #fff;
    color: #333;
    padding-left: 10px;
    padding: 20px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }
  #nome {
    width: 240px !important;
    padding-right: 30px;
    font-weight: bold;
  }
`;

export const Td = styled.td`
  color: #333;
  display: flex;
  flex-direction: row;

  align-items: center;
  width: 150px;
  padding-right: 10px;

  justify-content: center;
  /* &:nth-child(n + 7) {
    background-color: pink;
  } */
`;
