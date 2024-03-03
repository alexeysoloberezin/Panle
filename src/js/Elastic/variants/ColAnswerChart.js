import ElasticCharts from "@/js/Elastic/ElasticCharts";
import axios from "axios";

class ColAnswerChart extends ElasticCharts{
  fetchData = async (data) => {
    try {
      const response = await axios.post(
        this.url + this.projectUrl,
        data
      );
      const res = response.data.aggregations['0'].buckets[0].doc_count || 0

      if (response.data) {
        return {
          error: false,
          messageError: '',
          data: res.toLocaleString()
        }
      }else{
        return {
          error: true,
          messageError: 'Bed data',
          data: {}
        }
      }
    } catch (error) {
      return  {
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
                          "result.keyword": "ANSWER"
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

export default new ColAnswerChart()
