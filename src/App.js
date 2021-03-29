import logo from './logo.svg';
import './App.css';
// .js 생략해도 상관없다.
import Header from './components/Header'
import Contents from './components/Contents'

function App() {
  return (
    <div className="App">
      {/* 리액트에서는 클래스를 className으로 준다. */}
        <Header />
        <Contents />
    </div>
  );
}

export default App;
