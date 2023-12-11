import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { process } from '@/common/Api.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        reviews: [],
        reviewsForMap: [],
        curLon: undefined,
        curLat: undefined,
        curReviewId: undefined,
        curAddress: undefined,
        curTitle: undefined,
        curGrade: undefined,
        curReview: undefined,
        isDisabledInput: true,
        curFileList: [],
        isVisibleReviewList: true,
        isEndOfList: false,
    },
    mutations: {
        setIsDisabledInput: (state, bool) => {
            setIsDisabledInput(state, bool);
        },
        setCurReviewId: (state, id) => {
            state.curReviewId = id;
            setIsVisibleReviewList(state, false);
        },
        setCurTitle: (state, title) => {
            state.curTitle = title;
        },
        setCurAddress: (state, address) => {
            state.curAddress = address;
        },
        setCurGrade: (state, grade) => {
            state.curGrade = grade;
        },
        setCurReview: (state, review) => {
            state.curReview = review;
        },
        setReviewsByKeySet: (state, reviews) => {
            state.reviews = reviews;
            setIsVisibleReviewList(state, true);
        },
        addReviewsByKeySet: (state, reviews) => {
            state.reviews.push(...reviews);
        },
        setReviewsForMap: (state, reviews) => {
            state.reviewsForMap = reviews;
        },
        setReview: (state, review) => {
            setReview(state, review);
        },
        setCurFileList: (state, images) => {
            state.curFileList = images;
        },
        setLonLat: (state, { lon, lat }) => {
            state.curLon = lon;
            state.curLat = lat;
        },
        setIsVisibleReviewList: (state, bool) => {
            setIsVisibleReviewList(state, bool);
        },
        registerReview(state) {
            setIsVisibleReviewList(state, false);
            setIsDisabledInput(state, false);
            setReview(state);
        },
        setIsEndOfList(state, bool) {
            state.isEndOfList = bool;
        },
    },
    actions: {
        async setReview({ state, dispatch }, that) {
            await process(that, async () => {
                const result = await axios.get('/api/review/getReview', {
                    params: {
                        reviewId: state.curReviewId,
                    },
                });
                setReview(state, result.data);
                dispatch('setFileList', that);
            });
        },
        async setReviewsForMap({ commit }, that) {
            await process(that, async () => {
                const result = await axios.get('/api/review/getReviewsForMap');
                await commit('setReviewsForMap', result.data);
            });
        },
        async setReviewsByKeySet({ commit }, { that, reviewUpdateDate, reviewId }) {
            await process(that, async () => {
                const result = await axios.get('/api/review/getReviewsByKeySet', {
                    params: {
                        reviewUpdateDate: reviewUpdateDate,
                        reviewId: reviewId,
                    },
                });
                if (!reviewUpdateDate && !reviewId) commit('setReviewsByKeySet', result.data);
                else commit('addReviewsByKeySet', result.data);
                if (!result.data.length) commit('setIsEndOfList', true);
                else commit('setIsEndOfList', false);
            });
        },
        async setFileList({ commit, state }, that) {
            await process(that, async () => {
                const result = await axios.get('/api/file/getImages', {
                    params: { reviewId: state.curReviewId },
                });
                await commit('setCurFileList', result.data);
            });
        },
    },
    modules: {},
});

function setReview(state, review) {
    state.curReviewId = review ? review.id : review;
    state.curLat = review ? review.lat : review;
    state.curLon = review ? review.lon : review;
    state.curTitle = review ? review.title : review;
    state.curGrade = review ? review.grade : review;
    state.curAddress = review ? review.address : review;
    state.curReview = review ? review.review : review;
}

function setIsVisibleReviewList(state, bool) {
    state.isVisibleReviewList = bool;
}

function setIsDisabledInput(state, bool) {
    state.isDisabledInput = bool;
}
