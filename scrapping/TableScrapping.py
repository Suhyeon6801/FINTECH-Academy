from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get(
    'https://www.alimi.or.kr/api/a/vacant/selectApiVacant.do')

table = driver.find_element_by_class_name('search_list')
tableBody = table.find_element_by_tag_name('tbody') #id가 따로 없으면 tag_name, 여러개가 반복 되면 elements
rows = tableBody.find_elements_by_tag_name('tr')

for index, value in enumerate(rows):
    if index != 0:
        rowNo = value.find_elements_by_tag_name('td')[1]
        address = value.find_elements_by_tag_name('td')[2]
        homeType = value.find_elements_by_tag_name('td')[3]
        print(rowNo.text+address.text+homeType.text)
        
nextBtn = driver.find_element_by_xpath('//*[@id="list"]/tbody/tr[4]/td/ul/a[1]')
nextBtn.click()
        