const fs= require('fs');
const path = require('path');


const hospital= ['瑞金', '中山'];
const keshi = '科室';
const yisheng = '医生';
const zhenduan = ['感冒','骨折','发热','高血压','昏厥'];
//let shijian = '';
//let feiyong = ' ';
const yaopin = '药品';
const keshis = [];
const yishengs = []



for(let i=0;i<5;i++){
	keshis[i] = `${keshi}${i}`;
	yishengs[i]=[];
	for(let j = 0; j< 10;j++){
		yishengs[i][j]=`${yisheng}-${i}-${j}`;
	}
}



let fullData = [];



for(let i = 0; i< 500; i++){
	let keshiRand = Math.floor(Math.random()*5);
	let time = new Date(Date.now()-Math.random()*10000000000);

	fullData[i]={
		id: i,
		hospital: Math.random()>0.5?hospital[1]:hospital[0],
		keshi: keshis[keshiRand],
		yisheng:yishengs[keshiRand][Math.floor(Math.random()*10)],
		zhenduan: zhenduan[keshiRand],
		time:time,
		feiyong: Math.floor(Math.random()*1000),
		yaopin: "TBD"
	}
}



function byDimFeiyong(datas,...keys){
	let byDim = [];
	let unionkeys =[];
	datas.map(data=>{
		let unionkey = keys.map(key=>data[key]).join('/');
		if(unionkeys.indexOf(unionkey)===-1){
			unionkeys.push(unionkey);
			byDim[unionkeys.length-1]={};
			byDim[unionkeys.length-1]["key"] = unionkey;
			byDim[unionkeys.length-1].feiyong= data.feiyong;

		}else{
			byDim[unionkeys.indexOf(unionkey)].feiyong+=data.feiyong;
		}
	});	
	return byDim;
}



let byhospital = byDimFeiyong(fullData, "hospital");
let bykeshi = byDimFeiyong(fullData, "keshi");
let byyisheng = byDimFeiyong(fullData, "yisheng");
let byzhenduan = byDimFeiyong(fullData, "zhenduan");

let byhospitalbyyisheng = byDimFeiyong(fullData, "hospital","yisheng");
let byhospitalbyyishengbyzhenduan = byDimFeiyong(fullData, "hospital","yisheng","zhenduan");


let output = {
	data: fullData,
	byhospital,
	bykeshi,
	byyisheng,
	byzhenduan,
	byhospitalbyyisheng,
	byhospitalbyyishengbyzhenduan
};




//http://localhost:3333/byhospitalbyyishengbyzhenduan?key_like=%E5%8F%91%E7%83%AD



fs.writeFile(path.join(__dirname,'demo.json'), JSON.stringify(output), err=>console.log(err))