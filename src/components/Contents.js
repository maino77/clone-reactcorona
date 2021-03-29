//useState에 데이터를 담아서 배열을 관리하고 useEffect를 통해 api를 사용할 것.
//axios사용법
import {useState, useEffect} from 'react'
//컴포넌트들을 불러온다. 컴포넌트란 전체 시스템에서 교체할 수 있는 부품들
//여기서는 그래프가 해당한다.
import {Bar, Doughnut, Line} from "react-chartjs-2"
//axios를 불러옴
import axios from 'axios'
const Contents = () => {

    const [confirmedData, setConfirmedData] = useState({})
    const [quarantinedData, setQuarantinedData] = useState({})
    const [comparedData, setComparedData] = useState({})


    useEffect(() =>{
        //async, await을 통해 https를 모두 불러온 다음에 실행시킨다.
        const fetchEvents = async ()=>{
            //데이터를 가져옴
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr")
            //이것으로 포스트맨에서 봤던 api가 담겨있는 것을 console창 데이터에서 확인할 수 있다.
            // console.log(res)
            makeData(res.data)
        }
        const makeData = (items)=>{
                //forEach는 객체에서 사용되는 반복문으로 모든 값에 적용된다
                // items.forEach(item=> console.log(item))
            const arr = items.reduce((acc, cur) => {
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Deaths;
                const recovered = cur.Recovered;

                // 값이 들어있는지 확인한다
                const findItem = acc.find(a=> a.year === year && a.month === month);

                if(!findItem){
                    acc.push({year, month, date, confirmed, active, death, recovered})
                }
                if(findItem && findItem.date < date){
                    findItem.active = active;
                    findItem.death = death;
                    findItem.date = date;
                    findItem.year = year;
                    findItem.month = month;
                    findItem.recovered = recovered;
                    findItem.confirmed = confirmed
                }
                return acc;
            }, [])
            //데이터 전부가 아닌 필요한 부분만을 사용할 것
            //데이터를 가공할 것이기 때문에 mpa redeius filter를 잘 이용할 것.
            
            console.log(arr)
                const labels = arr.map(a=> `${a.month+1}월`);
                setConfirmedData({
                // labels: labels, (두 개가 같기 때문에 축약) -> labels
                labels,
                datasets: [
                    {
                        //api를 통해 가져온 데이터를 뿌려준다.
                        label: "국내 누적 확진자",
                        backgroundColor: "salmon",
                        fill: true,
                        //확진자 수를 배열 형태로 가공해서 넣어줄 예정
                        // arr.map(a=>{
                        //     return
                        // })
                        // 이런 형식으로 쓰면 중괄호를 넣고 리턴을 넣어 써야하나 한 줄로 쓰면
                        // arr.map(a=>)
                        // return을 쓰지 않아도 이해한다.
                        data: arr.map(a=>a.confirmed)
                    }
                ]
            });
            setQuarantinedData({
                labels,
                datasets: [
                    {
                        label: "월별 격리자 현황",
                        borderColor: "salmon",
                        //하단부분 영역이 채워지지 않도록 설정
                        fill: false,
                        data: arr.map(a=>a.active)
                    }
                ]
            });
            const last = arr[arr.length-1]
            setComparedData({
                labels: ["확진자", "격리해제", "사망"],
                datasets: [
                    {
                        label: "누적 확진, 해제, 사망 비율",
                        backgroundColor: ["#ff3d67", "#059bff", "#ffc233"],
                        borderColor: ["#ff3d67", "#059bff", "#ffc233"],
                        //하단부분 영역이 채워지지 않도록 설정
                        fill: false,
                        data: [last.confirmed, last.recovered, last.death]
                    }
                ]
            });
        }
        fetchEvents()
    }, [])


    return (
        <section>
        <h2>국내 코로나 현황</h2>
        <div className="contents">
            <div>
                <Bar data={confirmedData}
                //title 그래프 윗부분 (제목 등), legend 그래프 아랫부분 (데이터 설명)
                options={
                    {title: { display: true, text: "누적 확진자 추이", fontSize: 16}},
                {legend: {display: true, position: "bottom"}}
                } />
            </div>
            <div>
                <Line data={quarantinedData}
                //title 그래프 윗부분 (제목 등), legend 그래프 아랫부분 (데이터 설명)
                options={
                    {title: { display: true, text: "월별 격리자 현황", fontSize: 16}},
                {legend: {display: true, position: "bottom"}}
                } />
            </div>
            <div>
                <Doughnut data={comparedData}
                //title 그래프 윗부분 (제목 등), legend 그래프 아랫부분 (데이터 설명)
                options={
                    {title: { display: true, text: `누적 확진, 해제 사망 (${new Date().getMonth()+1}월)`, fontSize: 16}},
                {legend: {display: true, position: "bottom"}}
                } />
            </div>
        </div>
        </section>
    )
}

export default Contents
