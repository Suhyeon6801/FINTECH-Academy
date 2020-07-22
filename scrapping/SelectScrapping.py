from selenium import webdriver
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get(
    'http://luris.molit.go.kr/web/index.jsp')

element = Select(driver.find_element_by_xpath('//*[@id="gnb_tab11"]/div/div[2]/div/div[1]/ul/li[1]/select'))
element2 = Select(driver.find_element_by_xpath('//*[@id="gnb_tab11"]/div/div[2]/div/div[1]/ul/li[2]/select'))
element3 = Select(driver.find_element_by_xpath('//*[@id="gnb_tab11"]/div/div[2]/div/div[1]/ul/li[3]/select'))
element4 = Select(driver.find_element_by_xpath('//*[@id="gnb_tab11"]/div/div[2]/div/div[1]/ul/li[4]/select'))
element5 = driver.find_element_by_xpath('//*[@id="gnb_tab11"]/div/div[2]/div/div[2]/ul/li[2]/input')
element6 = driver.find_element_by_xpath('//*[@id="gnb_tab11"]/div/div[2]/div/div[2]/ul/li[4]/input')

button = driver.find_element_by_xpath('//*[@id="gnb_tab11"]/div/div[2]/div/div[3]/button')

element.select_by_visible_text('전라남도')
driver.implicitly_wait(0.1) # 뒤에 있는 내용이 같이 바뀌지 않도록, 앞에서 먼저 바꾸고!
element2.select_by_visible_text('고흥군')
driver.implicitly_wait(0.1) 
element3.select_by_visible_text('고흥읍')
driver.implicitly_wait(0.1) 
element4.select_by_visible_text('남계리')
element5.send_keys('45')
element6.send_keys('1')
button.click()

data = driver.find_element_by_xpath('//*[@id="printData3"]/tbody')
print(data.text)