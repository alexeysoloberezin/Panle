import ElasticCharts from "@/js/Elastic/ElasticCharts";
import axios from "axios";

class AllCalls extends ElasticCharts {
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

        const operatorKeys = [...new Set(buckets.flatMap(bucket => bucket['1'].buckets.map(el => el.key)))];

        const data = {}

        buckets.forEach(b => {
          b['1'].buckets.forEach(el => {
            if(data[el.key] === undefined){
              data[el.key] = {
                sum: el.doc_count,
                value: [el.doc_count]
              }
            }else{
              data[el.key] = {
                sum: data[el.key].sum + el.doc_count,
                value: [...data[el.key].value, el.doc_count]
              }
            }
          })
        })

        const makeData = (bucket) => operatorKeys.map((key) => {
          const matchingBucket = bucket['1'].buckets.find((el) => el.key === key);
          return matchingBucket ? +((matchingBucket.doc_count / data[key].sum) * 100).toFixed(1) : 0;
        })


        return {
          error: false,
          messageError: '',
          data: {
            labels: operatorKeys,
            datasets: buckets.map((b, index) => ({
              label: `${b.key}`,
              backgroundColor: this.getRandomColor(index),
              data: makeData(b),
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

  getData = (date, timeRange, userId) => ({
    "aggs": {
      "0": {
        "terms": {
          "field": "result.keyword",
          "order": {
            "_key": "desc"
          },
          "size": 9
        },
        "aggs": {
          "1": {
            "terms": {
              "field": "callerid.keyword",
              "order": {
                "_key": "asc"
              },
              "size": 999
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

export default new AllCalls()
