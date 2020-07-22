from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get(
    'https://www.melon.com/chart/')

# table = driver.find_element_by_tag_name('table')
# tableBody = table.find_element_by_tag_name('tbody') 
# rows = tableBody.find_elements_by_tag_name('tr')

tableBody = driver.find_element_by_xpath('//*[@id="frm"]/div/table/tbody')
tableRow = tableBody.find_elements_by_tag_name('tr')

for index, value in enumerate(tableRow):
    songNo = value.find_elements_by_tag_name('td')[0]
    singer = value.find_elements_by_tag_name('td')[3]
    print(songNo.text+singer.text)