import ElasticCharts from "@/js/Elastic/ElasticCharts";
import axios from "axios";

class ErrorDetectChart extends ElasticCharts {
  fetchData = async (data, inPrecents, autoInterval) => {
    try {
      const response = await axios.post(
        this.url + this.projectUrl,
        data
      );

      if (response.data) {
        const buckets = response.data.aggregations['0'].buckets;

        if (!Array.isArray(buckets)) return {error: true, messageError: 'Error DATA', data: []}
        if (buckets.length === 0) return {error: true, messageError: 'Данных нет', data: []}

        const operatorKeys = [...new Set(buckets.flatMap(bucket => bucket.key_as_string))];
        const data = {}
        let lenght = 0

        for (const dataKey in buckets[0]['1'].buckets) {
          data[dataKey] = []
        }

        const keys = Object.keys(data)
        keys.forEach(key => {
          buckets.forEach(b => {
            data[key].push(b['1'].buckets[key].doc_count)
          })
          if(!lenght){
            lenght = data[key].length
          }
          if(data[key].length > lenght){
            lenght = data[key].length
          }
        })

        if (!inPrecents) {
          return {
            error: false,
            messageError: '',
            data: {
              labels: operatorKeys.map((bucket) => new Date(bucket)),
              datasets: keys.map((key, index) => ({
                label: `${key}`,
                backgroundColor: this.getByNameErrorDetect(key),
                data: data[key],
                stack: 'stack',
              }))
            }
          }
        }



      } else {
        return {
          error: true,
          messageError: 'Bed data',
          data: {}
        }
      }
    } catch (error) {
      return {
        error: true,
        messageError: error.response?.data?.error?.type || 'Error',
        data: {}
      }
    }
  }

  getData = (date, timeRange, userId) => ({
    "aggs": {
      "0": {
        "date_histogram": {
          "field": "dt_call_start",
          "fixed_interval": this.calculateInterval(date, timeRange),
          "time_zone": "Asia/Singapore"
        },
        "aggs": {
          "1": {
            "filters": {
              "filters": {
                "Другое": {
                  "bool": {
                    "must": [],
                    "filter": [
                      {
                        "bool": {
                          "filter": [
                            {
                              "bool": {
                                "should": [
                                  {
                                    "match_phrase": {
                                      "prediction.internal_error.keyword": "true"
                                    }
                                  }
                                ],
                                "minimum_should_match": 1
                              }
                            },
                            {
                              "bool": {
                                "must_not": {
                                  "bool": {
                                    "should": [
                                      {
                                        "match_phrase": {
                                          "prediction.internal_error_message.keyword": "'id'"
                                        }
                                      }
                                    ],
                                    "minimum_should_match": 1
                                  }
                                }
                              }
                            },
                            {
                              "bool": {
                                "must_not": {
                                  "bool": {
                                    "should": [
                                      {
                                        "match_phrase": {
                                          "prediction.internal_error_message": "Can not add media to bridge: *"
                                        }
                                      }
                                    ],
                                    "minimum_should_match": 1
                                  }
                                }
                              }
                            },
                            {
                              "bool": {
                                "must_not": {
                                  "bool": {
                                    "should": [
                                      {
                                        "match_phrase": {
                                          "prediction.internal_error_message.keyword": "Too long waiting from VoskServer"
                                        }
                                      }
                                    ],
                                    "minimum_should_match": 1
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    ],
                    "should": [],
                    "must_not": []
                  }
                },
                "Канал закрылся": {
                  "bool": {
                    "must": [],
                    "filter": [
                      {
                        "bool": {
                          "should": [
                            {
                              "match": {
                                "prediction.internal_error_message": "id"
                              }
                            }
                          ],
                          "minimum_should_match": 1
                        }
                      }
                    ],
                    "should": [],
                    "must_not": []
                  }
                },
                "Проблема транскрибации": {
                  "bool": {
                    "must": [],
                    "filter": [
                      {
                        "bool": {
                          "should": [
                            {
                              "match_phrase": {
                                "prediction.internal_error_message": "Too long waiting from VoskServer"
                              }
                            }
                          ],
                          "minimum_should_match": 1
                        }
                      }
                    ],
                    "should": [],
                    "must_not": []
                  }
                },
                "Проблема на астериске": {
                  "bool": {
                    "must": [],
                    "filter": [
                      {
                        "bool": {
                          "should": [
                            {
                              "match_phrase": {
                                "prediction.internal_error_message": "Can not add media to bridge*"
                              }
                            }
                          ],
                          "minimum_should_match": 1
                        }
                      }
                    ],
                    "should": [],
                    "must_not": []
                  }
                },
                "Отсутствие детекции": {
                  "bool": {
                    "must": [],
                    "filter": [
                      {
                        "bool": {
                          "filter": [
                            {
                              "bool": {
                                "should": [
                                  {
                                    "match_phrase": {
                                      "result.keyword": "ANSWER"
                                    }
                                  }
                                ],
                                "minimum_should_match": 1
                              }
                            },
                            {
                              "bool": {
                                "must_not": {
                                  "bool": {
                                    "should": [
                                      {
                                        "exists": {
                                          "field": "prediction.result.keyword"
                                        }
                                      }
                                    ],
                                    "minimum_should_match": 1
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    ],
                    "should": [],
                    "must_not": []
                  }
                },
                "ОК": {
                  "bool": {
                    "must": [],
                    "filter": [
                      {
                        "bool": {
                          "should": [
                            {
                              "match_phrase": {
                                "prediction.internal_error.keyword": "false"
                              }
                            }
                          ],
                          "minimum_should_match": 1
                        }
                      }
                    ],
                    "should": [],
                    "must_not": []
                  }
                }
              }
            }
          }
        }
      }
    },
    "size": 0,
    "fields": [
      {
        "field": "@timestamp",
        "format": "date_time"
      },
      {
        "field": "dt_call_end",
        "format": "date_time"
      },
      {
        "field": "dt_call_start",
        "format": "date_time"
      },
      {
        "field": "dt_conv_start",
        "format": "date_time"
      },
      {
        "field": "end",
        "format": "date_time"
      },
      {
        "field": "start",
        "format": "date_time"
      }
    ],
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "runtime_mappings": {},
    "_source": {
      "excludes": []
    },
    "query": {
      "bool": {
        "must": [],
        "filter": [
          ...[
            userId
            && {"bool": {
                "should": [
                  {
                    "match": {
                      "userid": userId
                    }
                  }
                ],
                "minimum_should_match": 1
              }}

          ],
          {
            "range": {
              "dt_call_start": {
                "format": "strict_date_optional_time",
                "gte": Array.isArray(date) && date.length > 1 ? date[0] : "",
                "lte": Array.isArray(date) && date.length > 1 ? date[1] : ""
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    }
  })
}

export default new ErrorDetectChart()
