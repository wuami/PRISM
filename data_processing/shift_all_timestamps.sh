#name=michelle
#time=1432311861063
name=${1}
time=${2}
shiftby=-25200000

python updateTimeStamps.py datav3/"$name"_hrm_"$time".txt_new $shiftby 1
python updateTimeStamps.py datav3/"$name"_light_"$time".txt $shiftby 0
python updateTimeStamps.py datav3/"$name"_pedo_"$time".txt $shiftby 0
python updateTimeStamps.py datav3/"$name"_motion_"$time".txt $shiftby 0
