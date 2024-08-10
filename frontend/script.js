// 初始化地图
var map = L.map('map').setView([35.8617, 104.1954], 4); // 设置初始视图在中国中心，缩放级别为4

// 加载基础地图层
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 加载 GeoJSON 数据并添加交互功能
var geojsonLayer;

fetch('china_counties.geojson')  // 确保文件路径正确
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        geojsonLayer = L.geoJson(data, {
            style: function (feature) {
                return {
                    color: "#ff0000",  // 初始边界颜色
                    weight: 0.5,         // 边界线的宽度
                    fillOpacity: 0.2   // 填充的透明度
                };
            },
            onEachFeature: onEachFeature // 定义每个特征的功能
        }).addTo(map);
    });
    

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var username = document.getElementById('registerUsername').value;
    var password = document.getElementById('registerPassword').value;
    axios.post('http://localhost:3000/register', {
        username: username,
        password: password
    })
    .then(function (response) {
        alert('注册成功！');
        console.log(response);
    })
    .catch(function (error) {
        alert('注册失败！');
        console.error(error);
    });
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;
    axios.post('http://localhost:3000/login', {
        username: username,
        password: password
    })
    .then(function (response) {
        alert('登录成功！');
        console.log(response);
    })
    .catch(function (error) {
        alert('登录失败！');
        console.error(error);
    });
});

    
// 定义点击事件的响应
var visitedCount = 0; // 跟踪已访问的县级市数量
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: function(e) {
            var layer = e.target;
            //名字的形式是feature.properties.NL_NAME_1-feature.properties.NL_NAME_2-feature.properties.NL_NAME_3
            //取feature.properties.NL_NAME_1中的后半部分，用|分割
            //如果存在|，则取后半部分，否则取原来的名字

            var provinceName = feature.properties.NL_NAME_1;
            if (provinceName.indexOf('|') !== -1) {
                provinceName = feature.properties.NL_NAME_1.split('|')[1];
            }

            var cityName = feature.properties.NL_NAME_2;
            if (cityName.indexOf('|') !== -1) {
                cityName = feature.properties.NL_NAME_2.split('|')[1];
            }

            var areaName = provinceName + '-' + cityName + '-' + feature.properties.NL_NAME_3;
            //如果没有第三级的名字，就不显示
            if (feature.properties.NL_NAME_3 === "NA") {
                areaName = provinceName + '-' + cityName ;
            }
            document.getElementById('area-name').textContent = areaName;


            document.getElementById('info').style.visibility = 'visible';
        },
        mouseout: function(e) {
            document.getElementById('info').style.visibility = 'hidden';
        },
        click: function(e) {
            var clickedLayer = e.target;
            if (clickedLayer.clicked) {
                clickedLayer.setStyle({
                    color: '#ff0000', 
                    fillColor: '#ff0000',
                    fillOpacity: 0.2
                });
                clickedLayer.clicked = false;
                visitedCount--; // 减少计数
            } else {
                clickedLayer.setStyle({
                    color: '#0000ff',
                    fillColor: '#0000ff',
                    fillOpacity: 0.2
                });
                clickedLayer.clicked = true;
                visitedCount++; // 增加计数
            }
            document.getElementById('visited-count').textContent = visitedCount; // 更新页面上的显示
        }
    });
}

