import React from "react";
import { State, FiltersTexts, IUserDetails, FiltersTypes, IFilterFunctions, FilterTypesKey, FilteredData} from "./types";
import "./styles.scss";
import UserDetails from "./components/user-details/user-details.component";
import FilterCheckbox from "./components/filters/filter-checkbox/filter-checkbox.component";
interface Props {}

export default class FilterModule extends React.Component<Props> {
  state: State = {
    data: [],
    filtered_data: [],
    filters : {
      hasPhoto: {
        filter: "main_photo",
        text: "Has Photo",
        value: false,
        func: function(el: IUserDetails) {
          return !!el.main_photo;
        },
      },
      hasFavourite: {
        filter: "favourite",
        text: "Favourite",
        value: false,
        func: function(el: IUserDetails) {
          return !!el.favourite;
        }
      },
      hasContact: {
        filter: "contacts_exchanged",
        text: "In contact",
        value: false,
        func: function(el: IUserDetails) {
          return !!el.contacts_exchanged;
        }
      },
      inCompatibilityRange: {
        filter: "compatibility_score",
        text: "Compatibility Score",
        start: 1,
        end: 99,
        value: null,
        func: function(el: IUserDetails)  {
          return el.compatibility_score === this.value;
        }
      },
      inAgeRange: {
        filter: "age",
        text: "Age",
        start: 18,
        end: 95,
        value: null,
        func: function(el: IUserDetails) {
          return el.age === this.value;
        }
      },
      inHeightRange: {
        filter: "height_in_cm",
        text: "Height",
        start: 135,
        end: 210,
        value: null,
        func: function(el: IUserDetails) {
          return el.height_in_cm === this.value;
        }
      },
      inMyLocation: {
        filter: "city_name",
        text: "distance in km",
        value: '',
        func: function(el: IUserDetails) {
          return el.city.name === this.value;
        }
      }
  }
};

countAppliedFilters = 0;
filterFunctions = [];

  componentDidMount() {
    this.fetchMatches();
  }

  fetchMatches() {
    fetch("/api/v1/matches")
      .then(res => res.json())
      .then(res => this.setState({ data: res.matches, filtered_data: res.matches }),
        (err) => {
          console.error(err);
        });
  }

  handleCheckbox(value: any, filter: string) {
    this.handleFilters(filter, value);
  }

  handleFilters(filter: string, value: string | boolean | number) {
    const { filtered_data, data, filters}: any = this.state;

    switch (filter) {
      case FiltersTexts.hasPhoto:
          this.setState((state: State) => {
            return {
              ...state,
              filters: {
                ...state.filters,
                hasPhoto: {
                  ...state.filters.hasPhoto,
                  value: value
                }
              },
            };
          }, () => {
            if (value) { // true applied right away
              this.applyFilters(filtered_data, [filters.hasPhoto.func], 0);

            } else { // remove  right away
              this.checkFilters();
            }
        });
          break;

      case FiltersTexts.hasContact:
          this.setState((state: State) => {
            return {
              ...state,
              filters: {
                ...state.filters,
                hasContact: {
                  ...state.filters.hasContact,
                  value: value
                }
              },
            };
          }, () => {
              if (value) {  
                this.applyFilters(filtered_data, [filters.hasContact.func], 0);

              } else {  
                this.checkFilters();
              }
          });
        break;

       case FiltersTexts.hasFavourite:
              this.setState((state: State) => {
                return {
                  ...state,
                  filters: {
                    ...state.filters,
                    hasFavourite: {
                      ...state.filters.hasFavourite,
                      value: value
                    }
                  },
                };
              }, () => {
                  if (value) {  
                    this.applyFilters(filtered_data, [filters.hasFavourite.func], 0);
    
                  } else { 
                    this.checkFilters();
                  }
              });
        break;
    }
  }

  checkFilters() {
    const { data, filters } = this.state;
    const {...filterTypes }: any = filters;
    const filterFunctions: IFilterFunctions[] = [];

        Object.keys(filterTypes).forEach((props) => {
          if (filterTypes[props].value) {
            filterFunctions.push(filterTypes[props].func);
          }
        });

        this.applyFilters(data, filterFunctions, filterFunctions.length - 1);
  }

  applyFilters(data: FilteredData, filterFunc: IFilterFunctions[], lenght: number) {
      if (lenght >= 0) {
        this.applyFilters(data.filter((el: IUserDetails) => filterFunc[lenght](el)), filterFunc, lenght - 1);

      } else {
        this.setState((state) => {
          return {
            ...state,
            filtered_data: data
          };
        });
      }
  }

render () {
    return (
        <main>
          <header></header>
          <aside>
            <FilterCheckbox filter={this.state.filters.hasContact.filter}
                            handleCheckbox={(e: any, filter: string) => this.handleCheckbox(e, filter)}
                            text={this.state.filters.hasContact.text}>
            </FilterCheckbox>
            <FilterCheckbox filter={this.state.filters.hasPhoto.filter}
                            handleCheckbox={(e: any, filter: string) => this.handleCheckbox(e, filter)}
                            text={this.state.filters.hasPhoto.text}>
            </FilterCheckbox>
            <FilterCheckbox filter={this.state.filters.hasFavourite.filter}
                            handleCheckbox={(e: any, filter: string) => this.handleCheckbox(e, filter)}
                            text={this.state.filters.hasFavourite.text}>
            </FilterCheckbox>
          </aside>
          <div className="results-wrapper">
                {this.state.filtered_data.map((match, index) => {
                    return <UserDetails details={match} key={index}></UserDetails>;
                  })}
              </div>
        </main>
    );
  }
}