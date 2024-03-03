const makeDateParams = (params) => {
  const { date } = params

  if (!Array.isArray(date) || !date.length) {
    return params
  }

  let startTime, endTime;
  startTime = date[0].getTime()
  endTime = date[1].getTime()

  return {...params, startTime, endTime}
}

export default makeDateParams;
