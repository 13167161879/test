import React, { useState ,useEffect,useRef} from "react";
import {flushSync} from 'react-dom';
import {  Spin } from 'antd';
import axios from "axios";
import './App.css';

interface IListProp{
  id:string;
  name:string;
  time:string
}

interface IData{
  data:IListProp[];
  code:number;
  message:string
}

function useInterval(callback:any,delay:any) {
  const savedCallback = useRef<any>();
console.log(delay,'delay')
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
   }
  }, [delay]);
}


const App=() => {
const[top, setTop] = useState<number>(10);
const [list, setList] = useState<IListProp[]>([]);
const [visible,setVisible] = useState<boolean>(true);
const [loading,setLoading] = useState<boolean>(false)

const getList=async()=>{
  setLoading(true)
 const res = await axios.get('https://www.fastmock.site/mock/26c0b0c2a0b1a0866b4bbc30033db08e/api/postsList');
const {data:{data,code}}:{data:IData} =res;
if(code===200&&data&&Array.isArray(data)){
   setList(data)
  }
  setLoading(false)
};

  function movement() {
    if(!list?.length||list.length<7){
      return
    }
    if (Math.abs(top) > 30 * list?.length - 210) {
      flushSync(()=>{setTop(10)})
    }else{
      const num = top
      flushSync( ()=>{setTop(num - .3)});
    }
  };

  useInterval(movement, visible ? 10 : 100000000000);

  const stop=()=> {
    flushSync(()=>{
      setVisible(false)
    })
  };
  const action=()=>{
    flushSync(()=>{
      setVisible(true)
    })
  }

  useEffect(()=>{
    getList();
    
  },[])


  return (
    <div className='job-info'>
      <p className='job-info__title' 
      >
        <span style={{ fontSize: "14px", color: "#888888", marginLeft: "5px" }}>
          最新职位
        </span>
        <a  
          href=" "
          className='job-info__title__more'
        >
          更多
        </a>
      </p>

      <div className='job-info__list' 
        onMouseEnter={(e)=>{
          e.stopPropagation()
          stop()
        }}
        onMouseLeave={action}
          >
        <ul
       style={{marginTop:top}}
        className='job-info__list__wrap'
        >
          <Spin spinning={loading}>
          {list.map((item, index) => {
            return (
              <li key={index} className='job-info__list__item'>
                <span
                 className='job-info__list__item__posts'>
                  {item.id}
                </span>
                <span
                  className='job-info__list__item__address'
                >
                  {item.name}
                </span>
                <span
                 className='job-info__list__item__time'
                >
                  {item.time}
                </span>
              </li>
            );
          })}
          </Spin>
        </ul>
      </div>
    </div>
  );
};


export default App