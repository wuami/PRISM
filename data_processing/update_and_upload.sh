#name=michelle
#time=1432311861063
name=${1}
time=${2}
shiftby=-25200000

line1=$(head -1 ~/datav3/"$name"_hrm_"$time".txt)
[[ $line1 =~ \(.*\).*\((.*)\) ]]

python editTimeStamps.py ~/datav3/"$name"_hrm_"$time".txt ${BASH_REMATCH[1]} 1
python updateTimeStamps.py ~/datav3/"$name"_hrm_"$time".txt_new $shiftby 1
python updateTimeStamps.py ~/datav3/"$name"_light_"$time".txt $shiftby 0
python updateTimeStamps.py ~/datav3/"$name"_pedo_"$time".txt $shiftby 0
python updateTimeStamps.py ~/datav3/"$name"_motion_"$time".txt $shiftby 0

python txt2sqlv2.py -u $name -t $time
