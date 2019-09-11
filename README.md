# Interface
Hi there, I am Yanchi. The interface for visualizing the resulting 2017 UK election dataset is maintained in this repository. You can download it and check the visualization result on your device by following the instruction below.

## Prerequisite 
[Python 2](https://www.python.org/downloads/release/python-2714/) or [Python 3](https://www.python.org/downloads/release/python-374/)

## Download 
Click the 'clone' button and download the repository as .zip file. Unzip the file on your device.

## Initialize the interface
In the terminal, enter the **\uk2017** directory, and type the python commands below:

if you are using **python 2**:
```python
python2 -m SimpleHTTPServer
```

if you are using **python 3**:

```python
python3 -m http.server
```

Then open your browser, and type the following URL: **http://localhost:8000/**. Then you can check the viualization result of the resulting 2017 UK Election dataset which was processed by the pipeline proposed in my dissertation. If you would like to check the visualization result of the original 2017 UK Election dataset, you can view it through this [link](http://elections.iti.gr/uk2017/?normalised=false)

Some of the topics are merged in the visualization result of original 2017 UK Election dataset. For example, 'tories' are merged into the topic 'conservative'. Therefore, you may not find any visualization result about 'tories' through the above [link](http://elections.iti.gr/uk2017/?normalised=false). Please check the topics which appeared in both visualization results.
