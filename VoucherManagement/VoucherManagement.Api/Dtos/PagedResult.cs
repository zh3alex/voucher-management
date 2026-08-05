using System.Collections.Generic;

namespace VoucherManagement.Api.Dtos
{
    public class PagedResult<T>
    {
        public List<T> Items { get; }
        public int TotalCount { get; }
        public int PageNumber { get; }
        public int PageSize { get; }
        public int TotalPages { get; }

        public PagedResult(List<T> items, int totalCount, int pageNumber, int pageSize)
        {
            Items = items ?? new List<T>();
            TotalCount = totalCount;
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalPages = pageSize == 0 ? 0 : (int)System.Math.Ceiling(totalCount / (double)pageSize);
        }
    }
}
