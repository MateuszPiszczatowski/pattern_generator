import PrintSplitter from "./Components/PrintSplitter/PrintSplitter";
import TestImage from "./assets/Test.jpg";
import "./App.css";

function App() {
  return (
    <>
      <PrintSplitter imageHeight={350.7} imageSource={TestImage} imageWidth={255} />
    </>
  );
}

export default App;
