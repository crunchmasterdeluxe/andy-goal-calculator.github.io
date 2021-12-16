window.onload = initializePage();

async function initializePage() {
  // await createSlider();
  // await selectPath();
  // await drawInitialChart();
  document.getElementById('mountain').style.display = 'block';
  console.log('waiting');
}

const divisionList = [
  { name: '365', ids: [73,81,438,454,475,755,766,800,836,873,958], queryType: 'office', id: '1' },
  { name: 'Franchise', ids: 1, queryType: 'dealer', id: '2' },
  { name: 'GGM', ids: [182,243,478,548,687,749], queryType: 'office', id: '3' },
  { name: 'LGCY X', ids: [91], queryType: 'region', id: '4' },
  { name: 'NTRS', ids: [16,17,126,138,177,178,214,216,217,239,244,255,391,439,478,576,602,754,833,842,843,844,874,875,876,913,950], queryType: 'office', id: '5' },
  { name: 'SoCal', ids: [140,718], queryType: 'office', id: '6' }
];

async function createForm() {
  document.getElementById('formErrors').innerHTML = "";
  document.getElementById('formSuccesses').innerHTML = "";
  document.getElementById('secondary-nav').style.display = 'none';
  document.getElementById('chart').style.display = 'none';
  document.getElementById('requestComplete').style.display = 'none';
  document.getElementById('formbox').style.display = 'block';
}

class JiraRequest {
    constructor(request) {
      this.type = "jira_request";
        this.id = Math.random().toString(15).slice(2);
        this.request = request;
    }
}

function readFromLS() {
  let items = JSON.parse(localStorage.getItem('items'));
  if (items === null) {
      return [];
  }
  return items;
}

function writeToLS(item) {
    console.log('Adding info to local storage: ' + JSON.stringify(item));
    let itemArray = readFromLS();
    itemArray.push(item);
    localStorage.setItem('items', JSON.stringify(itemArray));
}

async function makeRequest() {
  console.log('working');
  errors = document.getElementById('formErrors');
  successes = document.getElementById('formSuccesses');
  let employee = document.getElementById('employee').value;
  if (employee == "") {
    errors.innerHTML = "";
    errors.innerHTML = "You must fill out all fields.";
    employee.focus();
    return;
  }
  let email = document.getElementById('email').value;
  if (email == "") {
    errors.innerHTML = "";
    errors.innerHTML = "You must fill out all fields.";
    email.focus();
    return;
  }
  let company = document.getElementById('company').value;
  if (company== "") {
    errors.innerHTML = "";
    errors.innerHTML = "You must fill out all fields.";
    company.focus();
    return;
  }
  let request = document.getElementById('request').value;
  if (request == "") {
    errors.innerHTML = "";
    errors.innerHTML = "You must fill out all fields.";
    request.focus();
    return;
  }
  // document.getElementById('main-body').innerHTML = '';
  // await createForm();
  let url = "https://hooks.zapier.com/hooks/catch/4840866/bmvg9eb/";
  // let jiraResponse = await fetch(url);
  // let jiraResource = await jiraResponse.json();
  fetch(url)
  .then((response) => {
    if(response.ok) {
      errors.innerHTML = "";
      successes.innerHTML = "";
      console.log(response.json());
      writeToLS(new JiraRequest(request));
      let items = readFromLS();
      if (items !== null) {
        if (items.length > 0) {
          let message = document.createElement('H1');
          message.innerText = "Success!";
          document.getElementById('formSuccesses').appendChild(message);

          let requestHistoryTitle = document.createElement('DIV');
          requestHistoryTitle.setAttribute('class','request-history-title');
          requestHistoryTitle.innerText = "Request History";
          successes.appendChild(requestHistoryTitle);

          document.getElementById('form-body').reset();

          items.forEach(item => {
            if (item.type == 'jira_request') {
              console.log(JSON.stringify(item));
              let requestHistory = document.createElement('DIV');
              requestHistory.setAttribute('class','request-history');
              requestHistory.setAttribute('id',item.id);
              requestHistory.innerText = "Request id " + item.id + ": " + item.request;
              successes.appendChild(requestHistory);
            }
          });
        }
      }

      // document.getElementById('formbox').style.display = 'none';
      // document.getElementById('requestComplete').style.display = 'block';
      return response;
      }
    throw Error(response.statusText);
  })
  .catch( error => {
    alert(error);
    errors.innerHTML = "";
    errors.innerHTML = "We encountered an error queueing your request in Jira. Please try back soon.";
  } )
}

async function displayItem(item) {
  let requestHistory = document.createElement('DIV');
  requestHistory.setAttribute('class','request-history');
  requestHistory.setAttribute('id',item.id);
  requestHistory.innerText = item.request;
  document.getElementById('requestComplete').appendChild('request-history')
}

async function firstDropdown() {
  document.getElementById('formbox').style.display = 'none';
  let node = document.getElementById('secondary-nav');
  while (node.hasChildNodes()) {
      node.removeChild(node.firstChild);
  }
  document.getElementById('secondary-nav').style.display = 'block';
  document.getElementById('chart').style.display = 'block';
  console.log("calculator path selected");
//   <div class="dropdown">
//   <button class="dropbtn">Dropdown</button>
//   <div class="dropdown-content">
//     <a href="#">Link 1</a>
//     <a href="#">Link 2</a>
//     <a href="#">Link 3</a>
//   </div>
// </div>
  let dropdown1 = document.createElement('DIV');
  dropdown1.setAttribute('class','dropdown');
  dropdown1.setAttribute('id','division-dropdown');

  let dropdownButton = document.createElement('DIV');
  dropdownButton.setAttribute('class','dropbtn');
  dropdownButton.setAttribute('id','dropbtn');
  dropdownButton.innerText = "Division";

  let dropdownContent = document.createElement('DIV');
  dropdownContent.setAttribute('class','dropdown-content');

  let divList = divisionList;
  console.table(JSON.stringify(divList));
  divList.forEach(division => {
      console.log(JSON.stringify(division));
      let dropdownItem = document.createElement('A');
      dropdownItem.setAttribute('id',division.name);
      dropdownItem.setAttribute('onclick',`getProjection(${division.id},${division.name});`)
      dropdownItem.innerText = division.name;
      dropdownContent.appendChild(dropdownItem);
  });

  dropdown1.appendChild(dropdownButton);
  dropdown1.appendChild(dropdownContent);
  document.getElementById('secondary-nav').appendChild(dropdown1);
  // document.getElementById('placeholder1').style = "";
  // await createSlider();
}

async function getProjection(divisionId,divisionName) {
  // API call to get historic numbers and add in projections
  let url = `http://lgcy-divisions.us-east-2.elasticbeanstalk.com/division/${divisionId}`;
  let lgcyResponse = await fetch(url);
  let resource = await lgcyResponse.json();
  console.log(resource);
  await drawInitialChart(resource,1);
}

function selectPath() {
  let directory = document.createElement('DIV');
  directory.setAttribute('class','directory');

  let choice = document.createElement('INPUT');
  choice.setAttribute('type', 'text');
  choice.setAttribute('class','choice');
  choice.setAttribute('name','choice');

  let question = document.createElement('LABEL');
  question.setAttribute('name','choice');
  question.innerText = "What would you like to do?";
  directory.appendChild(question);
  directory.appendChild(choice);
  document.getElementById('navigation-area').appendChild(directory);
}

async function updateSlider(resourceId,currentValue) {
  // console.log(currentValue);
  // let slideAmount = document.getElementById("rangeValue");
  // slideAmount.innerHTML = currentValue;
  await adjustPullthrough(resourceId,currentValue);
}

async function createSlider(resource,sliderVal=0) {
  console.log('resource'+resource['name']);
  let slider = document.createElement('DIV');
  slider.setAttribute('class','slider');

  let title = document.createElement('DIV');
  title.setAttribute('id','rangeTitle');
  title.innerText = "Pullthrough Adjustment";

  let tinkerer = document.createElement('DIV');
  tinkerer.setAttribute('class','tinkerer-main');

  let range = document.createElement('INPUT');
  range.setAttribute('type', 'range');
  range.setAttribute('min',-5);
  range.setAttribute('max',5);
  range.setAttribute('value',sliderVal);
  range.setAttribute('oninput', 'rangeValue.innerText = this.value');
  range.setAttribute('onchange',`updateSlider(${resource.id},this.value)`)
  // range.setAttribute('onchange',console.log('1111'));
  range.setAttribute('class','tinkerer');

  let value = document.createElement('P');
  value.setAttribute('id','rangeValue');
  // value.setAttribute('onchange',console.log('1111'));
  value.innerText = sliderVal;
  value.setAttribute('class','tinkerer');

  let percent = document.createElement('P');
  percent.setAttribute('id','percent');
  percent.innerText = "%";
  percent.setAttribute('class','tinkerer');

  slider.appendChild(title);
  tinkerer.appendChild(range);
  tinkerer.appendChild(value);
  tinkerer.appendChild(percent);
  slider.appendChild(tinkerer);
  document.getElementById('chart').appendChild(slider);
  // <div class="slider">
  //   <p id="sliderTitle">Pullthrough</p>
  //   <input type="range" min="-5" max="5" value="0" oninput="rangeValue.innerText = this.value">
  //   <p id="rangeValue">0</p><p>%</p>
  // </div>
}

async function adjustPullthrough(resourceId,amount){
  console.log(amount);
  let adjustment = 1;
  if (amount == -5) {
    adjustment = 0.95;
  }
  if (amount == -4) {
    adjustment = 0.96;
  }
  if (amount == -3) {
    adjustment = 0.97;
  }
  if (amount == -2) {
    adjustment = 0.98;
  }
  if (amount == -1) {
    adjustment = 0.99;
  }
  if (amount == 0) {
    adjustment = 1;
  }
  if (amount == 1) {
    adjustment = 1.01;
  }
  if (amount == 2) {
    adjustment = 1.02;
  }
  if (amount == 3) {
    adjustment = 1.03;
  }
  if (amount == 4) {
    adjustment = 1.04;
  }
  if (amount == 5) {
    adjustment = 1.05;
  }
  console.log(adjustment);
  await drawFollowChart(resourceId, adjustment,amount);
}

async function drawInitialChart(resource, adjustment) {
  console.log(adjustment);
  dropdownButton = document.getElementById('dropbtn');
  dropdownButton.innerText = resource['name'];
  // clear contents if any
  let node = document.getElementById('chart');
  while (node.hasChildNodes()) {
      node.removeChild(node.firstChild);
  }

  // await createSlider();

  let scorecards = document.createElement('DIV');
  scorecards.setAttribute('id','scorecards');
  let scorecardTitle = document.createElement('DIV');
  scorecardTitle.setAttribute('class','scorecard-title');
  scorecardTitle.innerText = 'Installed kWs';
  // scorecards.appendChild(scorecardTitle);
  document.getElementById('chart').appendChild(scorecardTitle);

  let adjustedConv1 = resource['2022_0_percent_growth'].map(function(i) {
  	return (i * adjustment);
  });
  let adjustedConv2 = resource['2022_10_percent_growth'].map(function(i) {
  	return (i * adjustment);
  });
  let adjustedConv3 = resource['2022_20_percent_growth'].map(function(i) {
  	return (i * adjustment);
  });
  let adjustedConv4 = resource['2022_30_percent_growth'].map(function(i) {
  	return (i * adjustment);
  });
  let adjustedConv5 = resource['2022_40_percent_growth'].map(function(i) {
  	return (i * adjustment);
  });
  let adjustedConv6 = resource['2022_50_percent_growth'].map(function(i) {
  	return (i * adjustment);
  });

  // sum up kWs for year
  total2021 = resource['2021_numbers'].reduce( (acc,i) => acc + i,0);
  let sum1 = document.createElement('DIV');
  sum1.setAttribute('class','cell');
  sum1.innerText = `2021\n${total2021}`;
  scorecards.appendChild(sum1);

  totalZero = adjustedConv1.reduce( (acc,i) => acc + i,0);
  let sum2 = document.createElement('DIV');
  sum2.setAttribute('class','cell');
  sum2.innerText = `2022 0% Growth\n${totalZero}`;
  scorecards.appendChild(sum2);

  totalOne = adjustedConv2.reduce( (acc,i) => acc + i,0);
  let sum3 = document.createElement('DIV');
  sum3.setAttribute('class','cell');
  sum3.innerText = `2022 10% Growth\n${totalOne}`;
  scorecards.appendChild(sum3);

  totalTwo = adjustedConv3.reduce( (acc,i) => acc + i,0);
  let sum4 = document.createElement('DIV');
  sum4.setAttribute('class','cell');
  sum4.innerText = `2022 20% Growth\n${totalTwo}`;
  scorecards.appendChild(sum4);

  totalThree = adjustedConv4.reduce( (acc,i) => acc + i,0);
  let sum5 = document.createElement('DIV');
  sum5.setAttribute('class','cell');
  sum5.innerText = `2022 30% Growth\n${totalThree}`;
  scorecards.appendChild(sum5);

  totalFour = adjustedConv5.reduce( (acc,i) => acc + i,0);
  let sum6 = document.createElement('DIV');
  sum6.setAttribute('class','cell');
  sum6.innerText = `2022 40% Growth\n${totalFour}`;
  scorecards.appendChild(sum6);

  totalFive = adjustedConv6.reduce( (acc,i) => acc + i,0);
  let sum7 = document.createElement('DIV');
  sum7.setAttribute('class','cell');
  sum7.innerText = `2022 50% Growth\n${totalFive}`;
  scorecards.appendChild(sum7);
  document.getElementById('chart').appendChild(scorecards);

  let slider = document.createElement('DIV');
  slider.setAttribute('id','slider-area');
  document.getElementById('chart').appendChild(slider);
  await createSlider(resource);


  let zero_trajectory = (resource['2021_numbers'].concat(adjustedConv1));
  let ten_trajectory = (resource['2021_numbers'].concat(adjustedConv2));
  let twenty_trajectory = (resource['2021_numbers'].concat(adjustedConv3));
  let thirty_trajectory = (resource['2021_numbers'].concat(adjustedConv4));
  let fourty_trajectory = (resource['2021_numbers'].concat(adjustedConv5));
  let fifty_trajectory = (resource['2021_numbers'].concat(adjustedConv6));
  let options = {
    chart: {
      type: 'line'
    },
    series: [{
      name: `${resource['name']} Current Trend`,
      data: zero_trajectory
    },
    {
      name: `${resource['name']} 10% Growth`,
      data: ten_trajectory
    },
    {
      name: `${resource['name']} 20% Growth`,
      data: twenty_trajectory
    },
    {
      name: `${resource['name']} 30% Growth`,
      data: thirty_trajectory
    },
    {
      name: `${resource['name']} 40% Growth`,
      data: fourty_trajectory
    },
    {
      name: `${resource['name']} 50% Growth`,
      data: fifty_trajectory
    }
],
    xaxis: {
      categories: ["1/2021","2/2021","3/2021","4/2021","5/2021","6/2021","7/2021","8/2021","9/2021","10/2021","11/2021","12/2021",
      "1/2022","2/2022","3/2022","4/2022","5/2022","6/2022","7/2022","8/2022","9/2022","10/2022","11/2022","12/2022"]
    }
  }

  let chart = new ApexCharts(document.querySelector("#chart"), options);

  chart.render();

}

async function drawFollowChart(resourceId, adjustment, sliderNum) {
  console.log(adjustment);
  let url = `http://lgcy-divisions.us-east-2.elasticbeanstalk.com/division/${resourceId}`;
  let lgcyResponse = await fetch(url);
  let resource = await lgcyResponse.json();
  dropdownButton = document.getElementById('dropbtn');
  dropdownButton.innerText = resource['name'];
  // clear contents if any
  let node = document.getElementById('chart');
  while (node.hasChildNodes()) {
      node.removeChild(node.firstChild);
  }

  // await createSlider();

  let scorecards = document.createElement('DIV');
  scorecards.setAttribute('id','scorecards');
  let scorecardTitle = document.createElement('DIV');
  scorecardTitle.setAttribute('class','scorecard-title');
  scorecardTitle.innerText = 'Installed kWs';
  // scorecards.appendChild(scorecardTitle);
  document.getElementById('chart').appendChild(scorecardTitle);

  let floor = Math.floor;

  let adjustedConv1 = resource['2022_0_percent_growth'].map(function(i) {
  	return floor(i * adjustment);
  });
  let adjustedConv2 = resource['2022_10_percent_growth'].map(function(i) {
  	return floor(i * adjustment);
  });
  let adjustedConv3 = resource['2022_20_percent_growth'].map(function(i) {
  	return floor(i * adjustment);
  });
  let adjustedConv4 = resource['2022_30_percent_growth'].map(function(i) {
  	return floor(i * adjustment);
  });
  let adjustedConv5 = resource['2022_40_percent_growth'].map(function(i) {
  	return floor(i * adjustment);
  });
  let adjustedConv6 = resource['2022_50_percent_growth'].map(function(i) {
  	return floor(i * adjustment);
  });

  // sum up kWs for year
  total2021 = resource['2021_numbers'].reduce( (acc,i) => acc + i,0);
  let sum1 = document.createElement('DIV');
  sum1.setAttribute('class','cell');
  sum1.innerText = `2021\n${total2021}`;
  scorecards.appendChild(sum1);

  totalZero = adjustedConv1.reduce( (acc,i) => acc + i,0);
  let sum2 = document.createElement('DIV');
  sum2.setAttribute('class','cell');
  sum2.innerText = `2022 0% Growth\n${totalZero}`;
  scorecards.appendChild(sum2);

  totalOne = adjustedConv2.reduce( (acc,i) => acc + i,0);
  let sum3 = document.createElement('DIV');
  sum3.setAttribute('class','cell');
  sum3.innerText = `2022 10% Growth\n${totalOne}`;
  scorecards.appendChild(sum3);

  totalTwo = adjustedConv3.reduce( (acc,i) => acc + i,0);
  let sum4 = document.createElement('DIV');
  sum4.setAttribute('class','cell');
  sum4.innerText = `2022 20% Growth\n${totalTwo}`;
  scorecards.appendChild(sum4);

  totalThree = adjustedConv4.reduce( (acc,i) => acc + i,0);
  let sum5 = document.createElement('DIV');
  sum5.setAttribute('class','cell');
  sum5.innerText = `2022 30% Growth\n${totalThree}`;
  scorecards.appendChild(sum5);

  totalFour = adjustedConv5.reduce( (acc,i) => acc + i,0);
  let sum6 = document.createElement('DIV');
  sum6.setAttribute('class','cell');
  sum6.innerText = `2022 40% Growth\n${totalFour}`;
  scorecards.appendChild(sum6);

  totalFive = adjustedConv6.reduce( (acc,i) => acc + i,0);
  let sum7 = document.createElement('DIV');
  sum7.setAttribute('class','cell');
  sum7.innerText = `2022 50% Growth\n${totalFive}`;
  scorecards.appendChild(sum7);
  document.getElementById('chart').appendChild(scorecards);

  let slider = document.createElement('DIV');
  slider.setAttribute('id','slider-area');
  document.getElementById('chart').appendChild(slider);
  await createSlider(resource,sliderNum);


  let zero_trajectory = (resource['2021_numbers'].concat(adjustedConv1));
  let ten_trajectory = (resource['2021_numbers'].concat(adjustedConv2));
  let twenty_trajectory = (resource['2021_numbers'].concat(adjustedConv3));
  let thirty_trajectory = (resource['2021_numbers'].concat(adjustedConv4));
  let fourty_trajectory = (resource['2021_numbers'].concat(adjustedConv5));
  let fifty_trajectory = (resource['2021_numbers'].concat(adjustedConv6));
  let options = {
    chart: {
      type: 'line'
    },
    series: [{
      name: `${resource['name']} Current Trend`,
      data: zero_trajectory
    },
    {
      name: `${resource['name']} 10% Growth`,
      data: ten_trajectory
    },
    {
      name: `${resource['name']} 20% Growth`,
      data: twenty_trajectory
    },
    {
      name: `${resource['name']} 30% Growth`,
      data: thirty_trajectory
    },
    {
      name: `${resource['name']} 40% Growth`,
      data: fourty_trajectory
    },
    {
      name: `${resource['name']} 50% Growth`,
      data: fifty_trajectory
    }
],
    xaxis: {
      categories: ["1/2021","2/2021","3/2021","4/2021","5/2021","6/2021","7/2021","8/2021","9/2021","10/2021","11/2021","12/2021",
      "1/2022","2/2022","3/2022","4/2022","5/2022","6/2022","7/2022","8/2022","9/2022","10/2022","11/2022","12/2022"]
    }
  }

  let chart = new ApexCharts(document.querySelector("#chart"), options);

  chart.render();

}
