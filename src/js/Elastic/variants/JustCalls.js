import ElasticCharts from "@/js/Elastic/ElasticCharts";
import axios from "axios";

class JustCalls extends ElasticCharts {
  fetchData = async (data) => {
    try {
      const response = await axios.post(
        this.url + this.projectUrl,
        data
      );


      if (response.data) {
        let buckets = response.data.aggregations['0'].buckets;

        if (!Array.isArray(buckets)) return {error: true, messageError: 'Error DATA', data: []}
        if (buckets.length === 0) return {error: true, messageError: 'Данных нет', data: []}

        const operatorKeys = [...new Set(buckets.flatMap(bucket => bucket.key))];
        const labels = [...new Set(buckets.flatMap(bucket => bucket['1'].buckets.map(el => el.key)))];

        const data = {}

        labels.forEach(key => {
          data[key] = []
        })

        buckets.forEach(b => {
          labels.forEach(label => {
            const matchingBucket = b['1'].buckets.find((el) => el.key === label);
            data[label].push(matchingBucket ? matchingBucket.doc_count : 0)
          })
        })

        return {
          error: false,
          messageError: '',
          data: {
            labels: operatorKeys,
            datasets: labels.map((label, index) => ({
              label: `${label}`,
              backgroundColor: this.getColorMyNameStatus(label),
              data: data[label],
              stack: 'stack',
            }))
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

  getData = (date, timeRange, userId, provider_name) => ({
    "aggs": {
      "0": {
        "terms": {
          "field": "callerid.keyword",
          "order": {
            "_count": "desc"
          },
          "size": 999
        },
        "aggs": {
          "1": {
            "terms": {
              "field": "result.keyword",
              "order": {
                "_key": "asc"
              },
              "size": 9
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
    "runtime_mappings": {
      "dd_int": {
        "type": "double",
        "script": {
          "source": "if (doc['prediction.detection_duration.keyword'].size() != 0 && doc['prediction.detection_duration.keyword'].value != '%{[end_reason][detection_duration]}'){\n    emit(Double.parseDouble(doc['prediction.detection_duration.keyword'].value));\n}"
        }
      }
    },
    "_source": {
      "excludes": []
    },
    "query": {
      "bool": {
        "must": [],
        "filter": [
          ...[
            userId
            && {
              "bool": {
                "should": [
                  {
                    "match": {
                      "userid": userId
                    }
                  }
                ],
                "minimum_should_match": 1
              }
            }

          ],
          {
            "bool": {
              "filter": [
                {
                  "bool": {
                    "should": [
                      {
                        "match_phrase": {
                          "direction.keyword": "OUT"
                        }
                      }
                    ],
                    "minimum_should_match": 1
                  }
                },
                {
                  "bool": {
                    "should": [
                      {
                        "match_phrase": {
                          "provider_name.keyword": provider_name
                        }
                      }
                    ],
                    "minimum_should_match": 1
                  }
                }
              ]
            }
          },
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

export default new JustCalls()
