import ElasticCharts from "@/js/Elastic/ElasticCharts";
import axios from "axios";

class CallsAllChart extends ElasticCharts {
  fetchData = async (data) => {
    try {
      const response = await axios.post(
        this.url + this.projectUrl,
        data
      );

      if (response.data) {
        let sum = 0
        const arr = response.data.aggregations['0'].buckets
        if(Array.isArray(arr)){
          arr.forEach(el => {
            sum += el.doc_count
          })
        }

        return {
          error: false,
          messageError: '',
          data: sum.toLocaleString()
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

  getData = (date, userId) => ({
    "aggs": {
      "0": {
        "terms": {
          "field": "result.keyword",
          "size": 10
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

export default CallsAllChart
