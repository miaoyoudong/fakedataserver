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
const yishengs = [];


const translation = {
	hospital:"医院",
	keshi:"科室",
	yisheng:"医生",
	zhenduan:"诊断",
	time:"时间",
	feiyong:"费用"
};


for(let i=0;i<5;i++){
	keshis[i] = `${keshi}${i}-${hospital[0]}`;
	keshis[i+5] = `${keshi}${i}-${hospital[1]}`;
	yishengs[i]=[];
	yishengs[i+5] = [];
	for(let j = 0; j< 10;j++){
		yishengs[i][j]=`${yisheng}-${i}-${j}-${hospital[0]}`;
		yishengs[i+5][j]=`${yisheng}-${i}-${j}-${hospital[1]}`;
	}
}



let fullData = [];



for(let i = 0; i< 500; i++){
	let hospitalRand = Math.random();
	let hospitalChoice = hospitalRand>0.5?hospital[1]:hospital[0];
	let keshiRand = Math.floor(Math.random()*5);
	keshiRand = hospitalRand>0.5?keshiRand+5:keshiRand;
	let time = new Date(Date.now()-Math.random()*10000000000);

	fullData[i]={
		id: i,
		hospital: hospitalRand>0.5?hospital[1]:hospital[0],
		keshi: keshis[keshiRand],
		yisheng:yishengs[keshiRand][Math.floor(Math.random()*10)],
		zhenduan: zhenduan[Math.floor(Math.random()*5)],
		time:time,
		feiyong: Math.floor(Math.random()*1000),
		yaopin: "TBD"
	}
}



function byDimFeiyong(datas,keys){
	let byDim = [];
	let unionkeys =[];
	datas.map(data=>{
		let fieldKeys = keys.map(key=>data[key]);
		let unionkey = fieldKeys.join("/");
		if(unionkeys.indexOf(unionkey)===-1){
			unionkeys.push(unionkey);
			byDim[unionkeys.length-1]={};
			byDim[unionkeys.length-1]['key'] = unionkey;
			keys.forEach((key,index)=>byDim[unionkeys.length-1][key] = fieldKeys[index]);
			byDim[unionkeys.length-1].feiyong= data.feiyong;
			byDim[unionkeys.length-1].details = [];
			byDim[unionkeys.length-1].details.push(data);
		}else{
			byDim[unionkeys.indexOf(unionkey)].feiyong+=data.feiyong;
			byDim[unionkeys.indexOf(unionkey)].details.push(data);
		}
	});	
	return byDim;
}


function createMetadata(key, members,type){
    return{
        id:key,
        fieldName:key,
        name:translation[key],
        members:members,
        type:type
    };
}


// let byhospital = byDimFeiyong(fullData, "hospital");
// let bykeshi = byDimFeiyong(fullData, "keshi");
// let byyisheng = byDimFeiyong(fullData, "yisheng");
// let byzhenduan = byDimFeiyong(fullData, "zhenduan");

// let byhospitalbyyisheng = byDimFeiyong(fullData, "hospital","yisheng");
// let byhospitalbyyishengbyzhenduan = byDimFeiyong(fullData, "hospital","yisheng","zhenduan");

// let byhospitalbyzhenduan = byDimFeiyong(fullData, "hospital","zhenduan");
// let byyishengbyzhenduan = byDimFeiyong(fullData, "yisheng","zhenduan");

// const hospital= ['瑞金', '中山'];
// const keshi = '科室';
// const yisheng = '医生';
// const zhenduan = ['感冒','骨折','发热','高血压','昏厥'];
// //let shijian = '';
// //let feiyong = ' ';
// const yaopin = '药品';
// const keshis = [];
// const yishengs = []
let metadata = [createMetadata('hospital',hospital,'Dimension'),createMetadata('keshi',keshis,'Dimension'),
createMetadata('yisheng',yishengs.join(",").split(","),'Dimension'),createMetadata('zhenduan',zhenduan,'Dimension'),
createMetadata('time',null,'Time'),createMetadata('feiyong',null,'Measure')];


function buildParse(arr){
	if(arr.length==1){
		return ["","by"+arr[0]];
	}
	let parseList = buildParse(arr.slice(1,arr.length));
	let parseList2 = parseList.map(l=>{
		if(l){
			return "by"+arr[0]+l;
		}
		return "by"+arr[0];
	});
	return [].concat(parseList,parseList2);
}

let output = {
	data: fullData,
    metadata
};
	// byhospital,
	// bykeshi,
	// byyisheng,
	// byzhenduan,
	// byhospitalbyyisheng,
	// byhospitalbyyishengbyzhenduan,
	// byhospitalbyzhenduan,
	// byyishengbyzhenduan,
const sequence = ['hospital','keshi','yisheng','zhenduan'];

let allSeq = buildParse(sequence);

allSeq.forEach(seq=>{
	if(seq){
		output[seq] = byDimFeiyong(fullData,seq.split("by").filter(d=>d!==""));
	}
})





//http://localhost:3333/byhospitalbyyishengbyzhenduan?key_like=%E5%8F%91%E7%83%AD



fs.writeFile(path.join(__dirname,'demo.json'), JSON.stringify(output), err=>console.log(err))