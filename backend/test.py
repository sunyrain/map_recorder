#链接mysql数据库
import pymysql
import json
import time

#连接数据库
def connect():
    db = pymysql.connect(
        host= '111.229.194.46',
        user= 'mapdata',
        password= '2022wenjieTHU',
        database= 'mapdata'
    )
    return db

#测试数据库连接
def test_connect():
    db = connect()
    cursor = db.cursor()
    cursor.execute('select version()')
    data = cursor.fetchone()
    print('Database version:', data)
    db.close()

#运行测试
if __name__ == '__main__':
    test_connect()
    print('Test success!')
