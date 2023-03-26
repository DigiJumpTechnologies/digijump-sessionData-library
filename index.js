const exerciseDataTypes = {
  TARGETED_CARDIO: "TARGETED_CARDIO",
  SPEED_FOCUSED_CARDIO: "SPEED_FOCUSED_CARDIO",
  RESISTANCE: "SINGLE_BAND_RESISTANCE",
  MARSDEN: "MARSDEN",
};


function calculateElapsedCardioTime(segmentRecord) {
    //Separate out two arrays of all START and END events
    if (!segmentRecord.events) {return null;}
    const startEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "START_TIME" && event.segType == "CARDIO";
    });
    const endEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "END_TIME" && event.segType == "CARDIO";
    });

    //If currently running then latest local END timestamp is set to Date.now()
    if (startEvents.length > endEvents.length) {
        endEvents.push({eventType: 'END_TIME', timestamp: Date.now(), segType: "CARDIO" });
    };

    const totalElapsedCardioTime = startEvents.reduce((acc, sEvent, index) => {
        return acc + endEvents[index].timestamp - sEvent.timestamp;
    }, [0]);

    let elapsedCardioTime = totalElapsedCardioTime - segmentRecord.msecondsCardioPaused;
    let elapsedCardioTimeSeconds = elapsedCardioTime/1000;
    return Math.floor(elapsedCardioTimeSeconds);
}

function calculateElapsedResistanceTime(segmentRecord) {
    if (!segmentRecord.events) {return null;}
    //Separate out two arrays of all START and END events
    const startEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "START_TIME" && event.segType == "RESISTANCE";
    });
    const endEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "END_TIME" && event.segType == "RESISTANCE";
    });

    //If currently running then latest local END timestamp is set to Date.now()
    if (startEvents.length > endEvents.length) {
        endEvents.push({eventType: 'END_TIME', timestamp: Date.now(), segType: "RESISTANCE" });
    };

    const totalElapsedResistanceTime = startEvents.reduce((acc, sEvent, index) => {
        return acc + endEvents[index].timestamp - sEvent.timestamp;
    }, [0]);

    let elapsedResistanceTime = totalElapsedResistanceTime - segmentRecord.msecondsResistancePaused;
    let elapsedResistanceTimeSeconds = elapsedResistanceTime/1000;
    return Math.floor(elapsedResistanceTimeSeconds);
}

function calculateElapsedFastFeetTime(segmentRecord) {
    //Separate out two arrays of all START and END events
    if (!segmentRecord.events) {
        return null;
    }
    const startEvents = segmentRecord.events.filter(
        (event) => {
        return event.eventType == "START_TIME" && event.segType == "FASTFEET";
        }
    );
    const endEvents = segmentRecord.events.filter(
        (event) => {
        return event.eventType == "END_TIME" && event.segType == "FASTFEET";
        }
    );

    //If currently running then latest local END timestamp is set to Date.now()
    if (startEvents.length > endEvents.length) {
        endEvents.push({
        eventType: "END_TIME",
        timestamp: Date.now(),
        segType: "FASTFEET",
        });
    }

    const totalElapsedFastFeetTime = startEvents.reduce(
        (acc, sEvent, index) => {
        return acc + endEvents[index].timestamp - sEvent.timestamp;
        },
        [0]
    );

    let elapsedFastFeetTime =
        totalElapsedFastFeetTime -
        segmentRecord.msecondsFastFeetPaused;
    let elapsedFastFeetTimeSeconds = elapsedFastFeetTime / 1000;
    return Math.floor(elapsedFastFeetTimeSeconds);
}

function calculateElapsedSegmentTypeTime (
  segmentRecord,
  segType) {
  //Separate out two arrays of all START and END events
  const {majorVer, minorVer} = parseVersionNumbers(segmentRecord);
  // console.log({majorVer, minorVer})
  //   if(majorVer <= 2 && minorVer > 3){
  //     console.log("old");
  //   }
  
  if (!segmentRecord.events) {
    return null;
  }
  
  const startEvents = segmentRecord.events.filter((event) => {
    return event.eventType == "START_TIME" && event.segType == segType;
  });
  const endEvents = segmentRecord.events.filter((event) => {
    return event.eventType == "END_TIME" && event.segType == segType;
  });

  //If currently running then latest local END timestamp is set to Date.now()
  if (startEvents.length > endEvents.length) {
    endEvents.push({
      eventType: "END_TIME",
      timestamp: Date.now(),
      segType: segType,
    });
  }

  

  const totalElapsedTime = startEvents.reduce(
    (acc, sEvent, index) => {
      return (
        acc +
        (endEvents[index].timestamp - endEvents[index].msecondsSegmentPaused) -
        sEvent.timestamp
      );
    },
    [0]
  );
  
  let elapsedTime = totalElapsedTime;
  let elapsedTimeSeconds = elapsedTime / 1000;
  
  return Math.floor(elapsedTimeSeconds);
};

function calculateElapsedSegmentDataTypeTime (
  segmentRecord,
  segDataType) {

    const {majorVer, minorVer} = parseVersionNumbers(segmentRecord);
    // console.log({majorVer, minorVer})
    // if(majorVer <= 2 && minorVer > 3){
    //   // console.log("old");
    // }
    // console.log("here1")
  //Separate out two arrays of all START and END events
  if (!segmentRecord.events) {
    return null;
  }
  // console.log("here 2")
  const startEvents = segmentRecord.events.filter((event) => {
    return event.eventType == "START_TIME" && event.segDataType == segDataType;
  });
  const endEvents = segmentRecord.events.filter((event) => {
    return event.eventType == "END_TIME" && event.segDataType == segDataType;
  });

  //If currently running then latest local END timestamp is set to Date.now()
  if (startEvents.length > endEvents.length) {
    endEvents.push({
      eventType: "END_TIME",
      timestamp: Date.now(),
      segDataType: segDataType,
    });
  }

  // console.log("start and end", segDataType, {startEvents, endEvents})

  const totalElapsedTime = startEvents.reduce(
    (acc, sEvent, index) => {
      let msecondsSegmentPaused = 0;
      if (endEvents[index].msecondsSegmentPaused) {
        msecondsSegmentPaused = endEvents[index].msecondsSegmentPaused;
      }
      return (
        acc +
        (endEvents[index].timestamp - msecondsSegmentPaused) -
        sEvent.timestamp
      );
    },
    [0]
  );

  let elapsedTime = totalElapsedTime;

  let elapsedTimeSeconds = elapsedTime / 1000;
  const floor = Math.floor(elapsedTimeSeconds);
  // console.log("DATA", {segDataType, elapsedTime, elapsedTimeSeconds, floor});
  
  return floor;
};

function identifyResultTypes(segmentRecord) {
    let segmentTypes = {
    resistance: false,
    targetedCardio: false,
    speedFocusedCardio: false,
    fastFeet: false,
    baseline: false,
    marsden: false,
  };
  if (segmentRecord.events) {
    const resistanceEvents = segmentRecord.events.filter((event) => {
      return (
        event.eventType == "START_TIME" &&
        event.segDataType == exerciseDataTypes.RESISTANCE
      );
    });
    if (resistanceEvents.length > 0) {
      segmentTypes.resistance = true;
    }
    const targetedCardioEvents = segmentRecord.events.filter((event) => {
      return (
        event.eventType == "START_TIME" &&
        event.segDataType == exerciseDataTypes.TARGETED_CARDIO
      );
    });
    if (targetedCardioEvents.length > 0) {
      segmentTypes.targetedCardio = true;
    }

    const speedFocusedCardioEvents = segmentRecord.events.filter((event) => {
      return (
        event.eventType == "START_TIME" &&
        event.segDataType == exerciseDataTypes.SPEED_FOCUSED_CARDIO
      );
    });

    if (speedFocusedCardioEvents.length > 0) {
      segmentTypes.speedFocusedCardio = true;
    }

    const marsdenEvents = segmentRecord.events.filter((event) => {
      return (
        event.eventType == "START_TIME" &&
        event.segDataType == exerciseDataTypes.MARSDEN
      );
    });

    if (marsdenEvents.length > 0) {
      segmentTypes.marsden = true;
    }

    const fastFeetEvents = segmentRecord.events.filter((event) => {
      return event.eventType == "START_TIME" && event.segType == "FASTFEET";
    });

    if (fastFeetEvents.length > 0) {
      segmentTypes.fastFeet = true;
    }

    const baselineEvents = segmentRecord.events.filter((event) => {
      return (
        event.eventType == "START_TIME" && event.segType == "BL-WARM-UP-CARDIO"
      );
    });

    if (baselineEvents.length > 0) {
      segmentTypes.baseline = true;
    }
    // console.log("RESULTS", segmentTypes);
    return segmentTypes;
  }
}

function calculateJumps(segmentRecord) {
    if (!segmentRecord.events) {return null;}
    const startEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "START_TIME" && event.segType == "CARDIO";
    });
    const endEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "END_TIME" && event.segType == "CARDIO";
    });

    //Sum the jumps counted in each cardio segment
    const jumps = startEvents.reduce( (jumpCount, startEvent, index) => {
        const currentSegmentInitialJumps = startEvent.currentJumps;
        //In case we're in the middle of a segment
        if (index < endEvents.length) {
            return jumpCount + (endEvents[index].currentJumps - currentSegmentInitialJumps);
        }
        else {
            return jumpCount + segmentRecord.jumps - currentSegmentInitialJumps;
        }
    }, 0);
    return jumps;
}

function calculateSegmentTypeJumps (segmentRecord, segType){
  if (!segmentRecord.events) {
    return null;
  }
  const startEvents = segmentRecord.events.filter(
    (event) => {
      return event.eventType == "START_TIME" && event.segType == segType;
    }
  );
  const endEvents = segmentRecord.events.filter(
    (event) => {
      return event.eventType == "END_TIME" && event.segType == segType;
    }
  );

  // console.log("START EVENTS", startEvents, segType);

  //Sum the jumps counted in each fast feet segment
  const jumps = startEvents.reduce((jumpCount, startEvent, index) => {
    // console.log({ jumpCount, startEvent, index });
    const currentSegmentInitialJumps = startEvent.currentJumps;
    //In case we're in the middle of a segment
    if (index < endEvents.length) {
      return (
        jumpCount + (endEvents[index].currentJumps - currentSegmentInitialJumps)
      );
    } else {
      return (
        jumpCount +
        segmentRecord.jumps -
        currentSegmentInitialJumps
      );
    }
  }, 0);

  return jumps;
};

function calculateSegmentDataTypeJumps (segmentRecord, segDataType){
  if (!segmentRecord.events) {
    return null;
  }
  const startEvents = segmentRecord.events.filter((event) => {
    return event.eventType == "START_TIME" && event.segDataType == segDataType;
  });
  const endEvents = segmentRecord.events.filter((event) => {
    return event.eventType == "END_TIME" && event.segDataType == segDataType;
  });

  //Sum the jumps counted in each fast feet segment
  const jumps = startEvents.reduce((jumpCount, startEvent, index) => {
    const currentSegmentInitialJumps = startEvent.currentJumps;
    //In case we're in the middle of a segment
    if (index < endEvents.length) {
      return (
        jumpCount + (endEvents[index].currentJumps - currentSegmentInitialJumps)
      );
    } else {
      return jumpCount + segmentRecord.jumps - currentSegmentInitialJumps;
    }
  }, 0);

  return jumps;
};

function calculateFastFeetScore(segmentRecord) {
    if (!segmentRecord.events) {
        return null;
    }
    const startEvents = segmentRecord.events.filter(
        (event) => {
        return event.eventType == "START_TIME" && event.segType == "FASTFEET";
        }
    );
    const endEvents = segmentRecord.events.filter(
        (event) => {
        return event.eventType == "END_TIME" && event.segType == "FASTFEET";
        }
    );

    //Sum the jumps counted in each fast feet segment
    const jumps = startEvents.reduce((jumpCount, startEvent, index) => {
        // console.log({ jumpCount, startEvent, index });
        const currentSegmentInitialJumps = startEvent.currentJumps;
        //In case we're in the middle of a segment
        if (index < endEvents.length) {
        return (
            jumpCount + (endEvents[index].currentJumps - currentSegmentInitialJumps)
        );
        } else {
        return (
            jumpCount +
            segmentRecord.jumps -
            currentSegmentInitialJumps
        );
        }
    }, 0);

    return jumps;
}

function calculateJumpsGood(segmentRecord) {
    const startEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "START_TIME" && event.segType == "CARDIO";
    });
    const endEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "END_TIME" && event.segType == "CARDIO";
    });

    //Sum the jumpsGood counted in each cardio segment
    const jumpsGood = startEvents.reduce( (jumpCount, startEvent, index) => {
        const currentSegmentInitialJumpsGood = startEvent.currentJumpsGood;
        //In case we're in the middle of a segment
        if (index < endEvents.length) {
            return jumpCount + (endEvents[index].currentJumpsGood - currentSegmentInitialJumpsGood);
        }
        else {
            return jumpCount + segmentRecord.jumpsGood - currentSegmentInitialJumpsGood;
        }
    }, 0);
    return jumpsGood;
}

function identifySegmentTypeEvents(segmentRecord, segType){
  if(!segmentRecord.events){
    return {startEvents: null, endEvents: null};
  }
  
  let startEvents = segmentRecord.events.filter(
    (event) => {
      return event.eventType == "START_TIME" && event.segType == segType;
    }
  );
  let endEvents = segmentRecord.events.filter(
    (event) => {
      return event.eventType == "END_TIME" && event.segType == segType;
    }
  );
  if (startEvents.length <= 0) {
    startEvents = null;
    endEvents = null;
  }
  return { startEvents, endEvents };

}

function identifySegmentDataTypeEvents(segmentRecord, segDataType){
  if (!segmentRecord.events) {
    return { startEvents: null, endEvents: null };
  }

  let startEvents = segmentRecord.events.filter((event) => {
    return event.eventType == "START_TIME" && event.segDataType == segDataType;
  });
  let endEvents = segmentRecord.events.filter((event) => {
    return event.eventType == "END_TIME" && event.segDataType == segDataType;
  });
  if (startEvents.length <= 0) {
    startEvents = null;
    endEvents = null;
  }
  return { startEvents, endEvents };

}

function calculateJumpPercentage(segmentRecord) {
    const samples = segmentRecord.jumpPercentageSamples;
    const {majorVer, minorVer} = parseVersionNumbers(segmentRecord);
    // console.log({majorVer, minorVer})
    if(majorVer >=2 && minorVer >= 3){
      return calculateSegmentTypeTotalJumpPercentage(segmentRecord, "CARDIO")
    }
    if(samples && samples.length){
        
      const sum = samples.reduce((a, b) => a + b)
        const length = samples.length;
        return Math.floor(sum/length);
    }
    return 0;
}

function calculateSegmentTypeTotalJumpPercentage(segmentRecord, segType){
    const samples =
    segmentRecord.jumpPercentageSamples;

  const { startEvents, endEvents } = identifySegmentTypeEvents(segmentRecord, segType);

  if (!startEvents) {
    return 0;
  }

  let percentArray = [];

  startEvents.forEach((element, index) => {
    const segmentStartTime = element.timestamp;
    let segmentEndTime;

    //in case segment was recently ended, but state has not yet updated
    if (!endEvents[index]) {
      segmentEndTime = Date.now();
    } else {
      segmentEndTime = endEvents[index].timestamp;
    }

    const segmentSamples = samples.filter((sample) => {
      return (
        sample.timestamp >= segmentStartTime &&
        sample.timestamp <= segmentEndTime
      );
    });

    segmentSamples.forEach((element) => {
      percentArray.push(element.percent);
    });
  });

  if (percentArray.length) {
    const sum = percentArray.reduce((a, b) => a + b);
    const length = percentArray.length;
    return Math.floor(sum / length);
  }
  return 0;
}

function calculateSegmentDataTypeTotalJumpPercentage(segmentRecord, segDataType){
  const samples = segmentRecord.jumpPercentageSamples;

  const { startEvents, endEvents } = identifySegmentDataTypeEvents(
    segmentRecord,
    segDataType
  );

  // console.log({ startEvents }, { endEvents });

  if (!startEvents) {
    return 0;
  }

  let percentArray = [];

  startEvents.forEach((element, index) => {
    const segmentStartTime = element.timestamp;
    let segmentEndTime;

    //in case segment was recently ended, but state has not yet updated
    if (!endEvents[index]) {
      segmentEndTime = Date.now();
    } else {
      segmentEndTime = endEvents[index].timestamp;
    }

    const segmentSamples = samples.filter((sample) => {
      return (
        sample.timestamp >= segmentStartTime &&
        sample.timestamp <= segmentEndTime
      );
    });

    segmentSamples.forEach((element) => {
      percentArray.push(element.percent);
    });
  });

  if (percentArray.length) {
    const sum = percentArray.reduce((a, b) => a + b);
    const length = percentArray.length;
    return Math.floor(sum / length);
  }
  return 0;
}


function parseVersionNumbers(segmentRecord) {
    if (segmentRecord.libraryVersion){
        const majorVer = parseInt(segmentRecord.libraryVersion.slice(1,2));
        const minorVer = parseInt(segmentRecord.libraryVersion.slice(3,4));
        const patchVer = parseInt(segmentRecord.libraryVersion.slice(5,6));
        return {majorVer, minorVer, patchVer};
    }
    // if undefined, then no way to know so assume earliest possible version
    else {
        return {majorVer: 1, minorVer: 0, patchVer: 0}
    }
}

function getSegmentTypeHRSamples(segmentRecord, segmentType) {
    const startEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "START_TIME" && event.segType == segmentType;
    });
    const endEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "END_TIME" && event.segType == segmentType;
    });

    //If currently running then latest local END timestamp is set to Date.now()
    if (startEvents.length > endEvents.length) {
        endEvents.push({eventType: 'END_TIME', timestamp: Date.now(), segType: segmentType });
    };
    
    return segmentRecord.heartBPMSamples.filter(sample => {
        let inRange = false;
        startEvents.forEach((event, index) => {
            if (sample.timestamp >= event.timestamp && sample.timestamp <= endEvents[index].timestamp) {
                inRange = true;
            }
        })
        return inRange;
    }) 
}

function getSegmentDataTypeHRSamples(segmentRecord, segmentDataType) {
    const startEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "START_TIME" && event.segDataType == segmentDataType;
    });
    const endEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "END_TIME" && event.segDataType == segmentDataType;
    });

    //If currently running then latest local END timestamp is set to Date.now()
    if (startEvents.length > endEvents.length) {
        endEvents.push({eventType: 'END_TIME', timestamp: Date.now(), segDataType: segmentDataType });
    };
    
    return segmentRecord.heartBPMSamples.filter(sample => {
        let inRange = false;
        startEvents.forEach((event, index) => {
            if (sample.timestamp >= event.timestamp && sample.timestamp <= endEvents[index].timestamp) {
                inRange = true;
            }
        })
        return inRange;
    }) 
}

function calculateSegmentDataTypeMaxHR(segmentRecord, segmentDataType) {
    let samples;
    const {majorVer, minorVer} = parseVersionNumbers(segmentRecord);
    if (majorVer > 1 || (majorVer == 1  && minorVer >= 4)) {
        let selectedSamples;
        if (majorVer > 2 || (majorVer == 2  && minorVer >= 0)) {
            selectedSamples = getSegmentDataTypeHRSamples(segmentRecord, segmentDataType);
        }
        else {selectedSamples = segmentRecord.heartBPMSamples}
        samples = selectedSamples.map(sample => sample.heartBPM)
    }
    else {
        samples = segmentRecord.heartBPMSamples;
    }

    if (!samples || samples.length == 0) {return 0;}
    return Math.max(...samples);
}

function calculateSegmentDataTypeMinHR(segmentRecord, segmentDataType) {
    let samples;
    const {majorVer, minorVer} = parseVersionNumbers(segmentRecord);
    if (majorVer > 1 || (majorVer == 1  && minorVer >= 4)) {
        let selectedSamples;
        if (majorVer > 2 || (majorVer == 2  && minorVer >= 0)) {
            selectedSamples = getSegmentDataTypeHRSamples(segmentRecord, segmentDataType);
        }
        else {selectedSamples = segmentRecord.heartBPMSamples}
        samples = selectedSamples.map(sample => sample.heartBPM)
    }
    else {
        samples = segmentRecord.heartBPMSamples;
    }
    if (!samples || samples.length == 0) {return 0;}
    return Math.min(...samples);
}

function calculateSegmentDataTypeAverageHR(segmentRecord, segmentDataType) {
    if (!segmentRecord.heartBPMSamples) {return null;}
    let totalHR = 0;
    let samples;
    const {majorVer, minorVer} = parseVersionNumbers(segmentRecord);
    if (majorVer > 1 || (majorVer == 1  && minorVer >= 4)) {
        let selectedSamples;
        if (majorVer > 2 || (majorVer == 2  && minorVer >= 0)) {
            selectedSamples = getSegmentDataTypeHRSamples(segmentRecord, segmentDataType);
        }
        else {selectedSamples = segmentRecord.heartBPMSamples}
        samples = selectedSamples.map(sample => sample.heartBPM)
    }
    else {
        samples = segmentRecord.heartBPMSamples;
    }
    let length = samples.length;
    let denominator = samples.length;
    for(var i = 0; i<length; i++){
        //dont take into account for average if value is 0
        if(samples[i] == 0){
            //if value is 0, skip this result and remove from average denominator
            denominator--;
        }else{
            //if value is not 0, add to total
            totalHR += samples[i];
        }
        
    }
    if (denominator <= 0) {
        return 0;
    }
    return Math.floor(totalHR/denominator);
}



function calculateSegmentTypeMaxHR(segmentRecord, segmentType) {
    let samples;
    const {majorVer, minorVer} = parseVersionNumbers(segmentRecord);
    if (majorVer > 1 || (majorVer == 1  && minorVer >= 4)) {
        let selectedSamples;
        if (majorVer > 2 || (majorVer == 2  && minorVer >= 0)) {
            selectedSamples = getSegmentTypeHRSamples(segmentRecord, segmentType);
        }
        else {selectedSamples = segmentRecord.heartBPMSamples}
        samples = selectedSamples.map(sample => sample.heartBPM)
    }
    else {
        samples = segmentRecord.heartBPMSamples;
    }

    if (!samples || samples.length == 0) {return 0;}
    return Math.max(...samples);
}

function calculateSegmentTypeMinHR(segmentRecord, segmentType) {
    let samples;
    const {majorVer, minorVer} = parseVersionNumbers(segmentRecord);
    if (majorVer > 1 || (majorVer == 1  && minorVer >= 4)) {
        let selectedSamples;
        if (majorVer > 2 || (majorVer == 2  && minorVer >= 0)) {
            selectedSamples = getSegmentTypeHRSamples(segmentRecord, segmentType);
        }
        else {selectedSamples = segmentRecord.heartBPMSamples}
        samples = selectedSamples.map(sample => sample.heartBPM)
    }
    else {
        samples = segmentRecord.heartBPMSamples;
    }
    if (!samples || samples.length == 0) {return 0;}
    return Math.min(...samples);
}

function calculateSegmentTypeAverageHR(segmentRecord, segmentType) {
    if (!segmentRecord.heartBPMSamples) {return null;}
    let totalHR = 0;
    let samples;
    const {majorVer, minorVer} = parseVersionNumbers(segmentRecord);
    if (majorVer > 1 || (majorVer == 1  && minorVer >= 4)) {
        let selectedSamples;
        if (majorVer > 2 || (majorVer == 2  && minorVer >= 0)) {
            selectedSamples = getSegmentTypeHRSamples(segmentRecord, segmentType);
        }
        else {selectedSamples = segmentRecord.heartBPMSamples}
        samples = selectedSamples.map(sample => sample.heartBPM)
    }
    else {
        samples = segmentRecord.heartBPMSamples;
    }
    let length = samples.length;
    let denominator = samples.length;
    for(var i = 0; i<length; i++){
        //dont take into account for average if value is 0
        if(samples[i] == 0){
            //if value is 0, skip this result and remove from average denominator
            denominator--;
        }else{
            //if value is not 0, add to total
            totalHR += samples[i];
        }
        
    }
    if (denominator <= 0) {
        return 0;
    }
    return Math.floor(totalHR/denominator);
}

function _getAthleteWeight(athlete) {
    if (!athlete) {return 0;}
    return athlete.weight;
}

function calculateTotalCaloriesBurned(segmentRecord, athlete) {
    const met = 12.3;
  const weightInKilograms = _getAthleteWeight(athlete) * 0.45359237;
  const timeInMinutes =
    calculateElapsedSegmentDataTypeTime(segmentRecord, exerciseDataTypes.TARGETED_CARDIO) /
    60;
  return Math.floor(0.0175 * met * weightInKilograms * timeInMinutes);
}

function calculateExerciseCount(segmentRecord, segType) {
    if (!segmentRecord.events) {return null;}
    const endEvents = segmentRecord.events.filter((event) => {
        return event.eventType == "END_TIME" && event.segType == segType;
    });
    return endEvents.length;
}

function calculateExerciseCountByDataType(segmentRecord, segDataType) {
    if (!segmentRecord.events) {
    return null;
  }
  const endEvents = segmentRecord.events.filter((event) => {
    return event.eventType == "END_TIME" && event.segDataType == segDataType;
  });
  return endEvents.length;
}

function calculateCurrentJPM(segmentRecord) {
    const jpmSamples = segmentRecord.jpmSamples;
    let secondsBetweenJumps = [];
    for(let i=0; i<(jpmSamples.length-1); i++){
        let sample1 = jpmSamples[i];
        let sample2 = jpmSamples[i+1];
        // console.log('SAMPLE 1', sample1, 'SAMPLE 2', sample2)
        let differenceInSeconds = (sample2 - sample1)/1000;
        secondsBetweenJumps.push((differenceInSeconds))
    }

    //get average of times between jumps 
    let total = secondsBetweenJumps.reduce((a,b) => a+b, 0)

    let average = total/secondsBetweenJumps.length;
    let length = secondsBetweenJumps.length;

    let jumpsPerSecond = 1/average;

    //convert jumps per minute
    let jumpsPerMinute = Math.ceil(jumpsPerSecond * 60);

    if(!jumpsPerMinute){
        jumpsPerMinute = 0;
    }

    return jumpsPerMinute;
}

const parseBandReadings = (parsedData, segmentRecord) =>{
    let bands = {'diffArray':[],};
    for(const singleStatus in parsedData){
        if(singleStatus =='lowerBandForce' || singleStatus == 'centerBandForce' || singleStatus == 'highBandForce' || singleStatus == 'topBandForce' ){

            //subtract band sensor offset
            const currentReading = parsedData[singleStatus]
            const startReading = segmentRecord.startStatus[singleStatus];
            // console.log('CURRENT DATA & START', currentReading, startReading, singleStatus)
            let diff = currentReading - startReading;



            // if(singleStatus == 'centerBandForce'){
            //     console.table({'band': singleStatus,
            //     'reading': currentReading,
            //     'startReading': startReading,
            //     'actualStart' : segmentRecord.startStatus[singleStatus],
            //     'difference': diff,
            //     'expDiff': Math.pow(diff,3)});
            // }

            bands[singleStatus] = {currentReading, startReading, diff};
            bands.diffArray.push(diff);
        
        }

    }

    return bands;
}

function calculateBandChanges(parsedData, segmentRecord) {
    const bands = parseBandReadings(parsedData, segmentRecord);

    //get max difference & determine what band is changing the most
    let callibratedBandReading;
    const maxDiff = Math.max(...bands.diffArray);
    for(const key in bands){
        if(bands[key].diff == maxDiff){
            bandChanging = key;
            callibratedBandReading = bands[key].currentReading;
            // console.log('CALLIBRATED BAND READING', callibratedBandReading, bands)
        }
    }
    return {bandChanging, callibratedBandReading, maxDiff};
}

function calculateSegmentTypeRepData (segmentRecord, segType) {
  const { startEvents, endEvents } = identifySegmentTypeEvents(segmentRecord, segType);

  if (!startEvents) {
    return 0;
  }

  let repCountArray = [];
  let repPoundsArray = [];
  startEvents.forEach((element, index) => {
    const segmentStartTime = element.timestamp;
    let segmentEndTime;

    //in case segment was recently ended, but state has not yet updated
    if (!endEvents[index]) {
      segmentEndTime = Date.now();
    } else {
      segmentEndTime = endEvents[index].timestamp;
    }

    const segmentRepEvents =
      segmentRecord.events.filter((event) => {
        return (
          event.timestamp >= segmentStartTime &&
          event.timestamp <= segmentEndTime &&
          event.eventType == "END_REP"
        );
      });

    segmentRepEvents.forEach((element) => {
      repPoundsArray.push(element.pounds);
    });

    repCountArray.push(segmentRepEvents.length);
  });

  const totalReps = repCountArray.reduce((a, b) => a + b);
  let totalPounds = 0;
  if (repPoundsArray.length) {
    const sum = repPoundsArray.reduce((a, b) => a + b);
    totalPounds = sum;
  }

  return { totalReps, totalPounds: totalPounds.toFixed(1) };
};

function calculateSegmentDataTypeRepData (segmentRecord, segDataType) {
  const { startEvents, endEvents } = identifySegmentDataTypeEvents(segmentRecord, segDataType);

  if (!startEvents) {
    return 0;
  }

  let repCountArray = [];
  let repPoundsArray = [];
  startEvents.forEach((element, index) => {
    const segmentStartTime = element.timestamp;
    let segmentEndTime;

    //in case segment was recently ended, but state has not yet updated
    if (!endEvents[index]) {
      segmentEndTime = Date.now();
    } else {
      segmentEndTime = endEvents[index].timestamp;
    }

    const segmentRepEvents =
      segmentRecord.events.filter((event) => {
        return (
          event.timestamp >= segmentStartTime &&
          event.timestamp <= segmentEndTime &&
          event.eventType == "END_REP"
        );
      });

    segmentRepEvents.forEach((element) => {
      repPoundsArray.push(element.pounds);
    });

    repCountArray.push(segmentRepEvents.length);
  });

  const totalReps = repCountArray.reduce((a, b) => a + b);
  let totalPounds = 0;
  if (repPoundsArray.length) {
    const sum = repPoundsArray.reduce((a, b) => a + b);
    totalPounds = sum;
  }

  return { totalReps, totalPounds: totalPounds.toFixed(1) };
};

function calculateSegmentTypeHRData (segmentRecord, segmentType) {
  const minHR = calculateSegmentTypeMinHR(
    segmentRecord,
    segmentType
  );
  const maxHR = calculateSegmentTypeMaxHR(
    segmentRecord,
    segmentType
  );

  const avgHR = calculateSegmentTypeAverageHR(
    segmentRecord,
    segmentType
  );

  return { minHR, maxHR, avgHR };
};

function calculateSegmentDataTypeHRData (segmentRecord, segmentDataType) {
  const minHR = calculateSegmentDataTypeMinHR(
    segmentRecord,
    segmentDataType
  );
  const maxHR = calculateSegmentDataTypeMaxHR(
    segmentRecord,
    segmentDataType
  );

  const avgHR = calculateSegmentDataTypeAverageHR(
    segmentRecord,
    segmentDataType
  );

  return { minHR, maxHR, avgHR };
};

module.exports = { calculateElapsedCardioTime,
         calculateElapsedResistanceTime,
         identifyResultTypes,
         calculateJumps,
         calculateJumpsGood,
         calculateJumpPercentage,
         calculateSegmentTypeMaxHR,
         calculateSegmentTypeMinHR,
         calculateSegmentTypeAverageHR,
         calculateTotalCaloriesBurned,
         calculateExerciseCount,
         calculateExerciseCountByDataType,
         calculateCurrentJPM,
         calculateBandChanges,
         getSegmentTypeHRSamples,
         calculateElapsedFastFeetTime,
         calculateFastFeetScore,
         calculateElapsedSegmentTypeTime,
         calculateElapsedSegmentDataTypeTime,
         calculateSegmentTypeJumps,
         calculateSegmentDataTypeJumps,
         calculateSegmentTypeTotalJumpPercentage,
         calculateSegmentDataTypeTotalJumpPercentage,
         identifySegmentTypeEvents,
         calculateSegmentTypeRepData,
         calculateSegmentTypeHRData,
         calculateSegmentDataTypeHRData,
         calculateSegmentDataTypeRepData,
         exerciseDataTypes
       };