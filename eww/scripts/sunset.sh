#!/bin/bash

PID=$(pgrep -x hyprsunset)

if [ -z "$PID" ]; then
            echo "hyprsunset activating."
            hyprsunset -t 3700& disown&
        else
            kill -9 $PID
            echo "Process killed."&
        fi
