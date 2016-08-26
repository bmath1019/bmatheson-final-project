# Filings Received by Federal Election Commission

This interactive visualization is designed to explore the distribution of reports recived by the Federal Election Division over the course of each election cycle. Data was collected using the Commission's updated website beta.fec.gov. Data was compiled for each form for the election cycles 2012, 2014, 2016:

* 2016 Cycle - Form 3, Form 3X and Form 5: https://beta.fec.gov/data/filings/?data_type=processed&min_receipt_date=02-01-2015&max_receipt_date=01-31-2017&form_type=F3&form_type=F3X&form_type=F5
* 2014 Cycle - Form 3, Form 3X and Form 5: https://beta.fec.gov/data/filings/?data_type=processed&min_receipt_date=02-01-2013&max_receipt_date=01-31-2015&form_type=F3&form_type=F3X&form_type=F5
* 2012 Cycle - Form 3, Form 3X and Form 5: https://beta.fec.gov/data/filings/?data_type=processed&min_receipt_date=02-01-2011&max_receipt_date=01-31-2013&form_type=F3&form_type=F3X&form_type=F5
* This data does not include data from paper filing committees. As a result, total for all reports/pages/dollars are deflated. The Form 3 is disproportionately affected because of the quatity of paer filing senate committees.

## Future Plans for the Visualization
* R code for aggregating the data and collecting data directly from the openFEC API will be added.
* In some situations the mouse over effect is not generating the correct date and/or total numbers. 
* An additional bar chart will be added under the light chart to the right of the table to show the % of reports/pages/dollars received relative to the % of days progressed through the election cycle. 